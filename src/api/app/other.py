# /src/api/app/other.py
# Other utility functions for the application


import time
import functools


def with_retry(retries=3, delay=5):
    """
    Decorator to retry a function call if it raises an exception.
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    print(f"Attempt {attempt + 1} failed: {e}")

                time.sleep(delay)

            if last_exception:
                print("All attempts failed.")
                raise last_exception

        return wrapper
    return decorator
