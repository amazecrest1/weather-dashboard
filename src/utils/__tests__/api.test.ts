import { 
  transformTemperatureData, 
  transformPrecipitationData, 
  transformWindSpeedData, 
  transformHourlyData,
  validateDateRange,
  getDaysDifference,
  formatDate,
  formatDateTime,
  getMinimumDate
} from '../api';
import { WeatherApiResponse } from '../../types/weather';

describe('API Utility Functions', () => {
  const mockDailyData: WeatherApiResponse = {
    daily: {
      time: ['2023-01-01', '2023-01-02', '2023-01-03'],
      temperature_2m_max: [10, 12, 8],
      temperature_2m_min: [2, 4, 1],
      temperature_2m_mean: [6, 8, 4],
      precipitation_sum: [0, 5, 10],
      wind_speed_10m_max: [15, 20, 25],
    },
  };

  const mockHourlyData: WeatherApiResponse = {
    hourly: {
      time: ['2023-01-01T00:00', '2023-01-01T01:00', '2023-01-01T02:00'],
      temperature_2m: [5, 6, 7],
      relative_humidity_2m: [80, 85, 90],
      apparent_temperature: [3, 4, 5],
      precipitation: [0, 0, 2],
      pressure_msl: [1013, 1014, 1015],
      wind_speed_10m: [10, 12, 14],
    },
  };

  describe('transformTemperatureData', () => {
    it('should transform daily temperature data correctly', () => {
      const result = transformTemperatureData(mockDailyData);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        date: 'Jan 1',
        max: 10,
        min: 2,
        mean: 6,
      });
      expect(result[1]).toEqual({
        date: 'Jan 2',
        max: 12,
        min: 4,
        mean: 8,
      });
    });

    it('should return empty array when no daily data', () => {
      const result = transformTemperatureData({});
      expect(result).toEqual([]);
    });
  });

  describe('transformPrecipitationData', () => {
    it('should transform precipitation data correctly', () => {
      const result = transformPrecipitationData(mockDailyData);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        date: 'Jan 1',
        value: 0,
      });
      expect(result[1]).toEqual({
        date: 'Jan 2',
        value: 5,
      });
    });

    it('should return empty array when no daily data', () => {
      const result = transformPrecipitationData({});
      expect(result).toEqual([]);
    });
  });

  describe('transformWindSpeedData', () => {
    it('should transform wind speed data correctly', () => {
      const result = transformWindSpeedData(mockDailyData);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        date: 'Jan 1',
        value: 15,
      });
      expect(result[2]).toEqual({
        date: 'Jan 3',
        value: 25,
      });
    });
  });

  describe('transformHourlyData', () => {
    it('should transform hourly data with selected parameters', () => {
      const result = transformHourlyData(mockHourlyData, ['temperature_2m', 'relative_humidity_2m']);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        time: 'Jan 1, 12:00 AM',
        temperature_2m: 5,
        relative_humidity_2m: 80,
      });
    });

    it('should return empty array when no parameters selected', () => {
      const result = transformHourlyData(mockHourlyData, []);
      expect(result).toEqual([]);
    });

    it('should return empty array when no hourly data', () => {
      const result = transformHourlyData({}, ['temperature_2m']);
      expect(result).toEqual([]);
    });
  });

  describe('validateDateRange', () => {
    it('should validate correct date range within last 90 days', () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      const result = validateDateRange(
        start.toISOString().split('T')[0], 
        end.toISOString().split('T')[0], 
        30
      );
      expect(result.isValid).toBe(true);
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const today = new Date();
      const result = validateDateRange(
        today.toISOString().split('T')[0], 
        futureDate.toISOString().split('T')[0], 
        30
      );
      expect(result.isValid).toBe(false);
    });

    it('should reject dates older than 90 days', () => {
      const oldStart = new Date();
      oldStart.setDate(oldStart.getDate() - 100);
      const oldEnd = new Date();
      oldEnd.setDate(oldEnd.getDate() - 95);
      const result = validateDateRange(
        oldStart.toISOString().split('T')[0], 
        oldEnd.toISOString().split('T')[0], 
        30
      );
      expect(result.isValid).toBe(false);
    });

    it('should reject range exceeding max days', () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 40);
      const result = validateDateRange(
        start.toISOString().split('T')[0], 
        end.toISOString().split('T')[0], 
        30
      );
      expect(result.isValid).toBe(false);
    });

    it('should reject start date after end date', () => {
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() - 1);
      const result = validateDateRange(
        start.toISOString().split('T')[0], 
        end.toISOString().split('T')[0], 
        30
      );
      expect(result.isValid).toBe(false);
    });
  });

  describe('getMinimumDate', () => {
    it('should return date 90 days ago by default', () => {
      const result = getMinimumDate();
      const expected = new Date();
      expected.setDate(expected.getDate() - 90);
      const expectedString = expected.toISOString().split('T')[0];
      
      expect(result).toBe(expectedString);
    });

    it('should return date with custom days back', () => {
      const result = getMinimumDate(30);
      const expected = new Date();
      expected.setDate(expected.getDate() - 30);
      const expectedString = expected.toISOString().split('T')[0];
      
      expect(result).toBe(expectedString);
    });
  });

  describe('getDaysDifference', () => {
    it('should calculate days difference correctly', () => {
      const result = getDaysDifference('2023-01-01', '2023-01-10');
      expect(result).toBe(9);
    });

    it('should handle same date', () => {
      const result = getDaysDifference('2023-01-01', '2023-01-01');
      expect(result).toBe(0);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const result = formatDate('2023-01-01');
      expect(result).toBe('Jan 1');
    });

    it('should format different month correctly', () => {
      const result = formatDate('2023-12-25');
      expect(result).toBe('Dec 25');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime correctly', () => {
      const result = formatDateTime('2023-01-01T15:30');
      expect(result).toBe('Jan 1, 03:30 PM');
    });

    it('should format midnight correctly', () => {
      const result = formatDateTime('2023-01-01T00:00');
      expect(result).toBe('Jan 1, 12:00 AM');
    });
  });
}); 