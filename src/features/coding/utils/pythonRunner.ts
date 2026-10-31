import { loadPyodide, type PyodideInterface } from 'pyodide';

import type { CodingTestCase } from './codingQuestions';

let pyodide: PyodideInterface | null = null;

export type TestCaseResult = {
  passed: boolean;
  actualOutput: unknown;
  expectedOutput: unknown;
  error: string | null;
};

export type PythonTestResult = {
  success: boolean;
  testResults: TestCaseResult[];
  error: string | null;
};

async function getPyodide(): Promise<PyodideInterface> {
  if (pyodide) {
    return pyodide;
  }

  pyodide = await loadPyodide({
    indexURL: '/pyodide/',
  });

  return pyodide;
}

export async function runPythonTestCases(
  code: string,
  functionName: string,
  testCases: CodingTestCase[]
): Promise<PythonTestResult> {
  try {
    const python = await getPyodide();

    const testCasesJson = JSON.stringify(testCases);

    const harness = `
import json

_user_namespace = {}
_final_result = None

try:
    exec(${JSON.stringify(code)}, _user_namespace)

    if "${functionName}" not in _user_namespace:
        raise Exception(
            "Function '${functionName}' was not found. "
            "Make sure you use the required function name."
        )

    _user_function = _user_namespace["${functionName}"]

    _test_cases = json.loads(
        ${JSON.stringify(testCasesJson)}
    )

    _results = []

    for _test_case in _test_cases:
        try:
            _inputs = _test_case["inputs"]
            _expected = _test_case["expectedOutput"]

            _actual = _user_function(*_inputs)

            _results.append({
                "passed": _actual == _expected,
                "actualOutput": _actual,
                "expectedOutput": _expected,
                "error": None
            })

        except Exception as _test_error:
            _results.append({
                "passed": False,
                "actualOutput": None,
                "expectedOutput": _test_case["expectedOutput"],
                "error": str(_test_error)
            })

    _final_result = json.dumps(_results)

except Exception as _error:
    _final_result = json.dumps({
        "fatalError": str(_error)
    })

_final_result
`;

    const result = await python.runPythonAsync(harness);

    if (result === undefined || result === null) {
      return {
        success: false,
        testResults: [],
        error: 'Python runner did not return a result.',
      };
    }

    const parsed = JSON.parse(String(result));

    if (parsed.fatalError) {
      return {
        success: false,
        testResults: [],
        error: parsed.fatalError,
      };
    }

    const testResults: TestCaseResult[] = parsed.map(
      (testCase: {
        passed: boolean;
        actualOutput: unknown;
        expectedOutput: unknown;
        error: string | null;
      }) => ({
        passed: testCase.passed,
        actualOutput: testCase.actualOutput,
        expectedOutput: testCase.expectedOutput,
        error: testCase.error,
      })
    );

    return {
      success: testResults.every(
        (testCase) => testCase.passed
      ),
      testResults,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      testResults: [],
      error:
        error instanceof Error
          ? error.message
          : String(error),
    };
  }
}