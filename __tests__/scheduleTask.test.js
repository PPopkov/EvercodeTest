const { ValidationError } = require("../src/errors/ValidationError");
const { log } = require("../src/logger");
const { scheduleTask } = require("../src/scheduler");

jest.useFakeTimers();

test("name is string", () => {
  expect(() => {
    scheduleTask(1, 1000, log);
  }).toThrow(ValidationError);
});

test("interval more zero", () => {
  expect(() => {
    scheduleTask("start", -10, log);
  }).toThrow(ValidationError);
});

test("task is function", () => {
  expect(() => {
    scheduleTask("start", 100, 5);
  }).toThrow(ValidationError);
});

const mockLog = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn()
}



test('scheduleTask success start', () => {
    jest.spyOn(global, 'setInterval');
    scheduleTask('start', 1000, mockLog.info);
    expect(setInterval).toHaveBeenCalled();
});