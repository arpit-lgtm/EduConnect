import { Platform } from 'react-native';

// Sensible default for local development:
// - Android emulator: use 10.0.2.2 to reach host's localhost
// - iOS simulator and macOS: use localhost
// - Physical devices: set REACT_NATIVE_API_HOST env or edit this file to your machine IP

const DEFAULT_PORT = 5000;
let host = 'localhost';
if (Platform.OS === 'android') host = '10.0.2.2';

export const API_BASE = `http://${host}:${DEFAULT_PORT}`;

export default { API_BASE };
