declare module 'play-sound' {
  interface PlayerOptions {
    player?: string;
    players?: string[];
    [key: string]: any;
  }

  interface PlayerInstance {
    play(file: string, options?: PlayerOptions, callback?: (err: Error | null) => void): any;
  }

  function player(options?: PlayerOptions): PlayerInstance;

  export default player;
}
