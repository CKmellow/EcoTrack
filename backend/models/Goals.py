
# models/goal.py
from pydantic import BaseModel
from typing import Optional
from datetime import date

class Goal(BaseModel):
    id: Optional[int] = None
    department_id: int   # Foreign key to Department
    target_value: float   # e.g. target reduction in kWh
    current_value: Optional[float] = 0.0
    previous_value: Optional[float] = 0.0
    deadline: date
    is_active: bool = True
INFO:     Started reloader process [18152] using StatReload
Process SpawnProcess-1:
Traceback (most recent call last):
  File "C:\Python313\Lib\multiprocessing\process.py", line 313, in _bootstrap
    self.run()
    ~~~~~~~~^^
  File "C:\Python313\Lib\multiprocessing\process.py", line 108, in run
    self._target(*self._args, **self._kwargs)
    ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\kanan\AppData\Roaming\Python\Python313\site-packages\uvicorn\_subprocess.py", line 80, in subprocess_started
    target(sockets=sockets)
    ~~~~~~^^^^^^^^^^^^^^^^^
  File "C:\Users\kanan\AppData\Roaming\Python\Python313\site-packages\uvicorn\server.py", line 67, in run
    return asyncio.run(self.serve(sockets=sockets))
           ~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Python313\Lib\asyncio\runners.py", line 195, in run
    return runner.run(main)
           ~~~~~~~~~~^^^^^^
  File "C:\Python313\Lib\asyncio\runners.py", line 118, in run
    return self._loop.run_until_complete(task)
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
  File "C:\Python313\Lib\asyncio\base_events.py", line 725, in run_until_complete
    return future.result()
           ~~~~~~~~~~~~~^^
  File "C:\Users\kanan\AppData\Roaming\Python\Python313\site-packages\uvicorn\server.py", line 71, in serve
    await self._serve(sockets)
  File "C:\Users\kanan\AppData\Roaming\Python\Python313\site-packages\uvicorn\server.py", line 78, in _serve
    config.load()
    ~~~~~~~~~~~^^
  File "C:\Users\kanan\AppData\Roaming\Python\Python313\site-packages\uvicorn\config.py", line 436, in load
    self.loaded_app = import_from_string(self.app)
                      ~~~~~~~~~~~~~~~~~~^^^^^^^^^^
  File "C:\Users\kanan\AppData\Roaming\Python\Python313\site-packages\uvicorn\importer.py", line 22, in import_from_string
    raise exc from None
  File "C:\Users\kanan\AppData\Roaming\Python\Python313\site-packages\uvicorn\importer.py", line 19, in import_from_string
    module = importlib.import_module(module_str)
  File "C:\Python313\Lib\importlib\__init__.py", line 88, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1331, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 935, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 1026, in exec_module
  File "<frozen importlib._bootstrap>", line 488, in _call_with_frames_removed
  File "C:\Users\kanan\OneDrive\Desktop\EcoTrack\backend\main.py", line 5, in <module>    
    from backend.routes import auth_routes, CoAdmin_routes, department_routes, ai_routes  
ModuleNotFoundError: No module named 'backend'
