#!/usr/bin/python

from . import PCA9685
import time

Dir = [
    'forward',
    'backward',
]
pwm = PCA9685.PCA9685(0x40, debug=False)
pwm.setPWMFreq(50)

class MotorDriver():
    def __init__(self):
        self.PWMA = 0
        self.AIN1 = 1
        self.AIN2 = 2
        self.PWMB = 5
        self.BIN1 = 3
        self.BIN2 = 4

    def MotorRun(self, motor, index, speed):
        if speed > 100:
            speed = 100
        if(motor == 0):
            pwm.setDutycycle(self.PWMA, speed)
            if(index == Dir[0]):
                pwm.setLevel(self.AIN1, 0)
                pwm.setLevel(self.AIN2, 1)
            else:
                pwm.setLevel(self.AIN1, 1)
                pwm.setLevel(self.AIN2, 0)
        else:
            pwm.setDutycycle(self.PWMB, speed)
            if(index == Dir[0]):
                pwm.setLevel(self.BIN1, 0)
                pwm.setLevel(self.BIN2, 1)
            else:
                pwm.setLevel(self.BIN1, 1)
                pwm.setLevel(self.BIN2, 0)

    def MotorStop(self, motor):
        if (motor == 0):
            pwm.setDutycycle(self.PWMA, 0)
        else:
            pwm.setDutycycle(self.PWMB, 0)

## Main code is here:
Motor = MotorDriver()

def joyControl(x, y):
    #yprint("X: {}, Y: {}".format(x,y))
    speedA = max(-1, min(1, y + x))*100
    speedB = max(-1, min(1, y - x))*100

    if speedA > 0:
        Motor.MotorRun(0, 'forward', speedA)
    else:
        Motor.MotorRun(0, 'backward', -speedA)

    if speedB > 0:
        Motor.MotorRun(1, 'forward', speedB)
    else:
        Motor.MotorRun(1, 'backward', -speedB)