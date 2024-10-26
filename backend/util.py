import importlib.util
import sys


def load_and_run_function(module_path, function_name, *args, **kwargs):
    # Load the module spec from the path
    spec = importlib.util.spec_from_file_location("dynamic_module", module_path)
    module = importlib.util.module_from_spec(spec)
    sys.modules["dynamic_module"] = module
    spec.loader.exec_module(module)

    # Run the desired function from the imported module
    if hasattr(module, function_name):
        func = getattr(module, function_name)
        return func(*args, **kwargs)
    else:
        raise AttributeError(
            f"The function '{function_name}' does not exist in {module_path}"
        )
