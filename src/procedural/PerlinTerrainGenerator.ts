import { PerlinNoise } from '../math/Noise';

export enum BiomeType {
  WATER = 0,
  SAND = 1,
  GRASS = 2,
  FOREST = 3,
  MOUNTAIN = 4,
  SNOW = 5
}

export class PerlinTerrainGenerator {
  public static generateTerrain(width: number, height: number, scale: number = 0.05, octaves: number = 4, seed: number = 12345): BiomeType[][] {
    const perlin = new PerlinNoise(seed);
    const biomeMap: BiomeType[][] = [];

    for (let x = 0; x < width; x++) {
      biomeMap[x] = [];
      for (let y = 0; y < height; y++) {
        let elevation = 0;
        let frequency = scale;
        let amplitude = 1;
        let maxAmplitude = 0;

        for (let o = 0; o < octaves; o++) {
          elevation += perlin.noise(x * frequency, y * frequency) * amplitude;
          maxAmplitude += amplitude;
          amplitude *= 0.5;
          frequency *= 2;
        }

        elevation = (elevation / maxAmplitude + 1) / 2; // Normalize to 0..1

        if (elevation < 0.3) biomeMap[x][y] = BiomeType.WATER;
        else if (elevation < 0.38) biomeMap[x][y] = BiomeType.SAND;
        else if (elevation < 0.6) biomeMap[x][y] = BiomeType.GRASS;
        else if (elevation < 0.75) biomeMap[x][y] = BiomeType.FOREST;
        else if (elevation < 0.9) biomeMap[x][y] = BiomeType.MOUNTAIN;
        else biomeMap[x][y] = BiomeType.SNOW;
      }
    }

    return biomeMap;
  }
}
