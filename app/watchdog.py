import time
import threading

class Watchdog:
    def __init__(self, func, timeout=1.0):
        self.func = func
        self.timeout = timeout
        self.last_ping_time = time.time()
        self.watchdog_thread = threading.Thread(target=self.watchdog_timer)
        self.watchdog_thread.start()

    def kick(self):
        self.last_ping_time = time.time()

    def watchdog_timer(self):
        while True:
            time_since_last_ping = time.time() - self.last_ping_time
            if time_since_last_ping > self.timeout:
                print('Connection lost! t={}'.format(time_since_last_ping))
                try:
                    self.func()
                except Exception as e:
                    print("Error occurred in func: ", str(e))
                    # alternatively, you could re-raise the exception with 'raise' if you want it to stop the execution
                time.sleep(self.timeout/10)

