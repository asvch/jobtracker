import importlib.util
import sys


def load_and_run_function(module_path, function_name, *args, **kwargs):
    """
    Dynamically loads a module from a given file path and runs a specified function from that module.

    Args:
        module_path (str): The file path to the module to be loaded.
        function_name (str): The name of the function to be executed from the loaded module.
        *args: Variable length argument list to be passed to the function.
        **kwargs: Arbitrary keyword arguments to be passed to the function.

    Returns:
        The return value of the specified function from the loaded module.

    Raises:
        AttributeError: If the specified function does not exist in the loaded module.
    """
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
