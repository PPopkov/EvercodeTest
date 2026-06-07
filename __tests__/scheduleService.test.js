const { scheduleService } = require("../src/services/schedulerService");

jest.useFakeTimers();

const mockLog = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn()
}

const mockPriceService = {
  syncPrices: jest.fn().mockResolvedValue()
};

test('syncPrices is called', () => {
  jest.spyOn(global, 'setTimeout');
  scheduleService(mockPriceService, 1000, mockLog);
  jest.advanceTimersByTime(1000);
  expect(mockPriceService.syncPrices).toHaveBeenCalled();
});