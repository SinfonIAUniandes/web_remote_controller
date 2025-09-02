// MicrophoneFeed.jsx
import React, { useEffect } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createTopic, subscribeToTopic } from '../../../services/RosManager';

// single shared AudioContext (module scope)
let sharedAudioContext = null;

function ensureAudioContext() {
  if (!sharedAudioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    sharedAudioContext = new Ctx();
    // Optional: resume on any user gesture if suspended
    const tryResume = () => {
      if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
        sharedAudioContext.resume().catch(() => {});
      }
      window.removeEventListener('click', tryResume);
      window.removeEventListener('keydown', tryResume);
    };
    window.addEventListener('click', tryResume);
    window.addEventListener('keydown', tryResume);
  }
  return sharedAudioContext;
}

// helper: convert incoming message.data into Int16Array
function toInt16Array(data) {
  // already a typed array?
  if (ArrayBuffer.isView(data)) return new Int16Array(data.buffer || data);
  // plain JS array of numbers?
  if (Array.isArray(data)) return Int16Array.from(data);
  // base64 string? try decode (rosbridge could send base64 for binary)
  if (typeof data === 'string') {
    try {
      const raw = atob(data); // decode base64
      const buf = new ArrayBuffer(raw.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i);
      // Interpret bytes as little-endian int16 pairs
      return new Int16Array(buf);
    } catch (e) {
      console.warn('Could not convert message.data string to Int16Array', e);
    }
  }
  // fallback: try to coerce
  return Int16Array.from([]);
}

const MicrophoneFeed = () => {
  const { ros } = useRos();

  useEffect(() => {
    if (!ros) {
      console.error("ROS connection not available.");
      return;
    }

    const audioCtx = ensureAudioContext();

    const microphoneTopic = createTopic(ros, '/mic', 'naoqi_bridge_msgs/msg/AudioBuffer');

    const unsub = subscribeToTopic(microphoneTopic, async (message) => {
      try {
        // debug info:
        // console.log('incoming message:', message);
        const freq = Number(message.frequency) || 16000; // fallback
        const int16 = toInt16Array(message.data);
        if (!int16 || int16.length === 0) {
          console.warn('Empty or invalid audio data received');
          return;
        }

        // ensure AudioContext is resumed (Chrome autoplay policy)
        if (audioCtx.state === 'suspended') {
          try {
            await audioCtx.resume();
            console.debug('AudioContext resumed');
          } catch (e) {
            console.warn('AudioContext resume failed', e);
            // continue anyway - resume may fail until a user gesture
          }
        }

        // convert int16 -> float32 in [-1, 1]
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) {
          // Int16 ranges -32768..32767
          float32[i] = int16[i] / 32768.0;
        }

        // create a buffer: 1 channel, length, sampleRate
        const buffer = audioCtx.createBuffer(1, float32.length, freq);
        buffer.getChannelData(0).set(float32);

        const src = audioCtx.createBufferSource();
        src.buffer = buffer;
        src.connect(audioCtx.destination);
        src.start();
      } catch (err) {
        console.error('Error handling mic message:', err);
      }
    });

    return () => {
      try {
        microphoneTopic.unsubscribe();
      } catch (e) {}
      if (typeof unsub === 'function') unsub();
      console.log('Suscripción al tópico del micrófono cancelada.');
    };
  }, [ros]);

  return null;
};

export default MicrophoneFeed;
