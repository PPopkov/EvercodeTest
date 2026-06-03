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
  syncPrices: jest.fn()
};

test('syncPrices is called', () => {
  jest.spyOn(global, 'setInterval');
  scheduleService(mockPriceService, 1000, mockLog);
  jest.advanceTimersByTime(1000);
  expect(mockPriceService.syncPrices).toHaveBeenCalled();
});