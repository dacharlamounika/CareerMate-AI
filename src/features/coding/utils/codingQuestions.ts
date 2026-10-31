export type CodingTestCase = {
  inputs: unknown[];
  expectedOutput: unknown;
};

export type CodingQuestion = {
  id: number;
  language: 'Python';
  topic: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  starterCode: string;
  functionName: string;
  testCases: CodingTestCase[];
  explanation: string;
};

export const codingQuestions: CodingQuestion[] = [
  // ============================================================
  // 1. VARIABLES & DATA TYPES
  // ============================================================

  {
    id: 1,
    language: 'Python',
    topic: 'Variables & Data Types',
    title: 'Add Two Numbers',
    description:
      'Create a function called add_numbers that accepts two numbers and returns their sum.',
    difficulty: 'Easy',
    starterCode: `def add_numbers(a, b):
    # Write your code here
    pass`,
    functionName: 'add_numbers',
    testCases: [
      { inputs: [10, 20], expectedOutput: 30 },
      { inputs: [5, 7], expectedOutput: 12 },
      { inputs: [-2, 8], expectedOutput: 6 },
      { inputs: [100, 250], expectedOutput: 350 },
    ],
    explanation:
      'Return the result of adding the two parameters.',
  },

  {
    id: 2,
    language: 'Python',
    topic: 'Variables & Data Types',
    title: 'Calculate Rectangle Area',
    description:
      'Create a function called rectangle_area that accepts length and width and returns the area.',
    difficulty: 'Easy',
    starterCode: `def rectangle_area(length, width):
    # Write your code here
    pass`,
    functionName: 'rectangle_area',
    testCases: [
      { inputs: [8, 5], expectedOutput: 40 },
      { inputs: [10, 10], expectedOutput: 100 },
      { inputs: [7, 4], expectedOutput: 28 },
      { inputs: [12, 3], expectedOutput: 36 },
    ],
    explanation:
      'The area of a rectangle is length multiplied by width.',
  },

  {
    id: 3,
    language: 'Python',
    topic: 'Variables & Data Types',
    title: 'Calculate Average',
    description:
      'Create a function called average that accepts three numbers and returns their average.',
    difficulty: 'Easy',
    starterCode: `def average(a, b, c):
    # Write your code here
    pass`,
    functionName: 'average',
    testCases: [
      { inputs: [10, 20, 30], expectedOutput: 20 },
      { inputs: [5, 10, 15], expectedOutput: 10 },
      { inputs: [2, 4, 6], expectedOutput: 4 },
      { inputs: [1, 2, 3], expectedOutput: 2 },
    ],
    explanation:
      'Add the three numbers and divide the result by 3.',
  },

  {
    id: 4,
    language: 'Python',
    topic: 'Variables & Data Types',
    title: 'Swap Two Variables',
    description:
      'Create a function called swap_values that accepts two values and returns them in swapped order.',
    difficulty: 'Medium',
    starterCode: `def swap_values(a, b):
    # Write your code here
    pass`,
    functionName: 'swap_values',
    testCases: [
      { inputs: [10, 20], expectedOutput: [20, 10] },
      { inputs: [5, 9], expectedOutput: [9, 5] },
      { inputs: [100, 1], expectedOutput: [1, 100] },
    ],
    explanation:
      'Python supports direct multiple assignment, allowing two values to be swapped easily.',
  },

  {
    id: 5,
    language: 'Python',
    topic: 'Variables & Data Types',
    title: 'Calculate Simple Interest',
    description:
      'Create a function called simple_interest that accepts principal, rate and time and returns the simple interest.',
    difficulty: 'Hard',
    starterCode: `def simple_interest(principal, rate, time):
    # Write your code here
    pass`,
    functionName: 'simple_interest',
    testCases: [
      { inputs: [5000, 5, 2], expectedOutput: 500 },
      { inputs: [1000, 10, 3], expectedOutput: 300 },
      { inputs: [2000, 7.5, 2], expectedOutput: 300 },
      { inputs: [10000, 4, 5], expectedOutput: 2000 },
    ],
    explanation:
      'Simple interest is calculated using (P × R × T) / 100.',
  },

  // ============================================================
  // 2. CONDITIONS
  // ============================================================

  {
    id: 6,
    language: 'Python',
    topic: 'Conditions',
    title: 'Check Even or Odd',
    description:
      'Create a function called check_even_odd that returns "Even" or "Odd".',
    difficulty: 'Easy',
    starterCode: `def check_even_odd(number):
    # Write your code here
    pass`,
    functionName: 'check_even_odd',
    testCases: [
      { inputs: [12], expectedOutput: 'Even' },
      { inputs: [7], expectedOutput: 'Odd' },
      { inputs: [20], expectedOutput: 'Even' },
      { inputs: [15], expectedOutput: 'Odd' },
    ],
    explanation:
      'A number is even when number % 2 equals zero.',
  },

  {
    id: 7,
    language: 'Python',
    topic: 'Conditions',
    title: 'Check Positive or Negative',
    description:
      'Create a function called check_number that returns "Positive", "Negative", or "Zero".',
    difficulty: 'Easy',
    starterCode: `def check_number(number):
    # Write your code here
    pass`,
    functionName: 'check_number',
    testCases: [
      { inputs: [-7], expectedOutput: 'Negative' },
      { inputs: [10], expectedOutput: 'Positive' },
      { inputs: [0], expectedOutput: 'Zero' },
      { inputs: [-25], expectedOutput: 'Negative' },
    ],
    explanation:
      'Use if, elif and else to compare the number with zero.',
  },

  {
    id: 8,
    language: 'Python',
    topic: 'Conditions',
    title: 'Find Larger Number',
    description:
      'Create a function called larger_number that returns the larger of two numbers.',
    difficulty: 'Easy',
    starterCode: `def larger_number(a, b):
    # Write your code here
    pass`,
    functionName: 'larger_number',
    testCases: [
      { inputs: [25, 18], expectedOutput: 25 },
      { inputs: [5, 12], expectedOutput: 12 },
      { inputs: [100, 50], expectedOutput: 100 },
      { inputs: [-2, 4], expectedOutput: 4 },
    ],
    explanation:
      'Compare the two values and return the larger one.',
  },

  {
    id: 9,
    language: 'Python',
    topic: 'Conditions',
    title: 'Check Voting Eligibility',
    description:
      'Create a function called voting_eligibility that returns "Eligible" if age is 18 or above, otherwise "Not Eligible".',
    difficulty: 'Medium',
    starterCode: `def voting_eligibility(age):
    # Write your code here
    pass`,
    functionName: 'voting_eligibility',
    testCases: [
      { inputs: [21], expectedOutput: 'Eligible' },
      { inputs: [18], expectedOutput: 'Eligible' },
      { inputs: [17], expectedOutput: 'Not Eligible' },
      { inputs: [15], expectedOutput: 'Not Eligible' },
    ],
    explanation:
      'Check whether age is greater than or equal to 18.',
  },

  {
    id: 10,
    language: 'Python',
    topic: 'Conditions',
    title: 'Find Largest of Three Numbers',
    description:
      'Create a function called largest_of_three that returns the largest of three numbers without using max().',
    difficulty: 'Hard',
    starterCode: `def largest_of_three(a, b, c):
    # Write your code here
    pass`,
    functionName: 'largest_of_three',
    testCases: [
      { inputs: [45, 72, 61], expectedOutput: 72 },
      { inputs: [100, 50, 75], expectedOutput: 100 },
      { inputs: [10, 20, 30], expectedOutput: 30 },
      { inputs: [-5, -2, -8], expectedOutput: -2 },
    ],
    explanation:
      'Compare the three values using conditional statements.',
  },

  // ============================================================
  // 3. LOOPS
  // ============================================================

  {
    id: 11,
    language: 'Python',
    topic: 'Loops',
    title: 'Generate Numbers',
    description:
      'Create a function called generate_numbers that returns a list containing numbers from 1 to n.',
    difficulty: 'Easy',
    starterCode: `def generate_numbers(n):
    # Write your code here
    pass`,
    functionName: 'generate_numbers',
    testCases: [
      { inputs: [5], expectedOutput: [1, 2, 3, 4, 5] },
      { inputs: [3], expectedOutput: [1, 2, 3] },
      { inputs: [1], expectedOutput: [1] },
      { inputs: [7], expectedOutput: [1, 2, 3, 4, 5, 6, 7] },
    ],
    explanation:
      'Use a loop to generate numbers starting from 1 through n.',
  },

  {
    id: 12,
    language: 'Python',
    topic: 'Loops',
    title: 'Generate Even Numbers',
    description:
      'Create a function called even_numbers that returns all even numbers from 2 through n.',
    difficulty: 'Easy',
    starterCode: `def even_numbers(n):
    # Write your code here
    pass`,
    functionName: 'even_numbers',
    testCases: [
      { inputs: [10], expectedOutput: [2, 4, 6, 8, 10] },
      { inputs: [6], expectedOutput: [2, 4, 6] },
      { inputs: [5], expectedOutput: [2, 4] },
      { inputs: [2], expectedOutput: [2] },
    ],
    explanation:
      'Use a loop and include numbers divisible by 2.',
  },

  {
    id: 13,
    language: 'Python',
    topic: 'Loops',
    title: 'Calculate Sum',
    description:
      'Create a function called sum_numbers that returns the sum of numbers from 1 to n.',
    difficulty: 'Easy',
    starterCode: `def sum_numbers(n):
    # Write your code here
    pass`,
    functionName: 'sum_numbers',
    testCases: [
      { inputs: [10], expectedOutput: 55 },
      { inputs: [5], expectedOutput: 15 },
      { inputs: [3], expectedOutput: 6 },
      { inputs: [1], expectedOutput: 1 },
    ],
    explanation:
      'Initialize a total and add each number from 1 through n.',
  },

  {
    id: 14,
    language: 'Python',
    topic: 'Loops',
    title: 'Multiplication Table',
    description:
      'Create a function called multiplication_table that returns the first 10 multiples of a number.',
    difficulty: 'Medium',
    starterCode: `def multiplication_table(number):
    # Write your code here
    pass`,
    functionName: 'multiplication_table',
    testCases: [
      {
        inputs: [5],
        expectedOutput: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
      },
      {
        inputs: [2],
        expectedOutput: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      },
      {
        inputs: [7],
        expectedOutput: [7, 14, 21, 28, 35, 42, 49, 56, 63, 70],
      },
    ],
    explanation:
      'Loop from 1 to 10 and multiply the number by each value.',
  },

  {
    id: 15,
    language: 'Python',
    topic: 'Loops',
    title: 'Calculate Factorial',
    description:
      'Create a function called factorial that returns the factorial of a positive integer using a loop.',
    difficulty: 'Hard',
    starterCode: `def factorial(n):
    # Write your code here
    pass`,
    functionName: 'factorial',
    testCases: [
      { inputs: [5], expectedOutput: 120 },
      { inputs: [4], expectedOutput: 24 },
      { inputs: [3], expectedOutput: 6 },
      { inputs: [1], expectedOutput: 1 },
    ],
    explanation:
      'Factorial is the product of all positive integers from 1 through n.',
  },

  // ============================================================
  // 4. STRINGS
  // ============================================================

  {
    id: 16,
    language: 'Python',
    topic: 'Strings',
    title: 'Reverse a String',
    description:
      'Create a function called reverse_string that returns the reversed string.',
    difficulty: 'Easy',
    starterCode: `def reverse_string(text):
    # Write your code here
    pass`,
    functionName: 'reverse_string',
    testCases: [
      { inputs: ['python'], expectedOutput: 'nohtyp' },
      { inputs: ['hello'], expectedOutput: 'olleh' },
      { inputs: ['abc'], expectedOutput: 'cba' },
      { inputs: ['computer'], expectedOutput: 'retupmoc' },
    ],
    explanation:
      'Python string slicing with [::-1] can reverse a string.',
  },

  {
    id: 17,
    language: 'Python',
    topic: 'Strings',
    title: 'Count Characters',
    description:
      'Create a function called count_characters that returns the number of characters in a string.',
    difficulty: 'Easy',
    starterCode: `def count_characters(text):
    # Write your code here
    pass`,
    functionName: 'count_characters',
    testCases: [
      { inputs: ['hello'], expectedOutput: 5 },
      { inputs: ['python'], expectedOutput: 6 },
      { inputs: ['abc'], expectedOutput: 3 },
      { inputs: ['hello world'], expectedOutput: 11 },
    ],
    explanation:
      'The len() function returns the number of characters in a string.',
  },

  {
    id: 18,
    language: 'Python',
    topic: 'Strings',
    title: 'Convert to Uppercase',
    description:
      'Create a function called to_uppercase that returns the given string in uppercase.',
    difficulty: 'Easy',
    starterCode: `def to_uppercase(text):
    # Write your code here
    pass`,
    functionName: 'to_uppercase',
    testCases: [
      { inputs: ['python'], expectedOutput: 'PYTHON' },
      { inputs: ['hello world'], expectedOutput: 'HELLO WORLD' },
      { inputs: ['programming'], expectedOutput: 'PROGRAMMING' },
      { inputs: ['abc123'], expectedOutput: 'ABC123' },
    ],
    explanation:
      'The upper() method converts alphabetic characters to uppercase.',
  },

  {
    id: 19,
    language: 'Python',
    topic: 'Strings',
    title: 'Count Vowels',
    description:
      'Create a function called count_vowels that returns the number of vowels in a string.',
    difficulty: 'Medium',
    starterCode: `def count_vowels(text):
    # Write your code here
    pass`,
    functionName: 'count_vowels',
    testCases: [
      { inputs: ['programming'], expectedOutput: 3 },
      { inputs: ['hello'], expectedOutput: 2 },
      { inputs: ['education'], expectedOutput: 5 },
      { inputs: ['xyz'], expectedOutput: 0 },
    ],
    explanation:
      'Loop through the characters and count a, e, i, o and u.',
  },

  {
    id: 20,
    language: 'Python',
    topic: 'Strings',
    title: 'Check Palindrome String',
    description:
      'Create a function called is_palindrome that returns "Palindrome" or "Not Palindrome".',
    difficulty: 'Hard',
    starterCode: `def is_palindrome(text):
    # Write your code here
    pass`,
    functionName: 'is_palindrome',
    testCases: [
      { inputs: ['madam'], expectedOutput: 'Palindrome' },
      { inputs: ['level'], expectedOutput: 'Palindrome' },
      { inputs: ['python'], expectedOutput: 'Not Palindrome' },
      { inputs: ['hello'], expectedOutput: 'Not Palindrome' },
    ],
    explanation:
      'A palindrome reads the same forward and backward.',
  },

  // ============================================================
  // 5. LISTS
  // ============================================================

  {
    id: 21,
    language: 'Python',
    topic: 'Lists',
    title: 'Find Largest Number',
    description:
      'Create a function called find_largest that returns the largest number in a list without using max().',
    difficulty: 'Easy',
    starterCode: `def find_largest(numbers):
    # Write your code here
    pass`,
    functionName: 'find_largest',
    testCases: [
      { inputs: [[10, 25, 7, 40, 18]], expectedOutput: 40 },
      { inputs: [[5, 2, 9, 1]], expectedOutput: 9 },
      { inputs: [[100, 50, 75]], expectedOutput: 100 },
      { inputs: [[-5, -2, -8]], expectedOutput: -2 },
    ],
    explanation:
      'Keep track of the largest value while iterating through the list.',
  },

  {
    id: 22,
    language: 'Python',
    topic: 'Lists',
    title: 'Find List Sum',
    description:
      'Create a function called list_sum that returns the sum of all numbers in a list.',
    difficulty: 'Easy',
    starterCode: `def list_sum(numbers):
    # Write your code here
    pass`,
    functionName: 'list_sum',
    testCases: [
      { inputs: [[10, 20, 30, 40]], expectedOutput: 100 },
      { inputs: [[1, 2, 3]], expectedOutput: 6 },
      { inputs: [[5, 5, 5]], expectedOutput: 15 },
      { inputs: [[10, -5, 2]], expectedOutput: 7 },
    ],
    explanation:
      'Add each value in the list to a running total.',
  },

  {
    id: 23,
    language: 'Python',
    topic: 'Lists',
    title: 'Count Even Numbers',
    description:
      'Create a function called count_even that returns how many even numbers are present in a list.',
    difficulty: 'Easy',
    starterCode: `def count_even(numbers):
    # Write your code here
    pass`,
    functionName: 'count_even',
    testCases: [
      { inputs: [[1, 2, 3, 4, 5, 6, 8]], expectedOutput: 4 },
      { inputs: [[2, 4, 6]], expectedOutput: 3 },
      { inputs: [[1, 3, 5]], expectedOutput: 0 },
      { inputs: [[10, 11, 12]], expectedOutput: 2 },
    ],
    explanation:
      'Check each number using number % 2 == 0.',
  },

  {
    id: 24,
    language: 'Python',
    topic: 'Lists',
    title: 'Remove Duplicates',
    description:
      'Create a function called remove_duplicates that removes duplicate values while preserving the original order.',
    difficulty: 'Medium',
    starterCode: `def remove_duplicates(numbers):
    # Write your code here
    pass`,
    functionName: 'remove_duplicates',
    testCases: [
      {
        inputs: [[1, 2, 2, 3, 1, 4, 3]],
        expectedOutput: [1, 2, 3, 4],
      },
      {
        inputs: [[5, 5, 5, 2, 2]],
        expectedOutput: [5, 2],
      },
      {
        inputs: [[1, 2, 3]],
        expectedOutput: [1, 2, 3],
      },
      {
        inputs: [[4, 4, 3, 2, 3]],
        expectedOutput: [4, 3, 2],
      },
    ],
    explanation:
      'Keep a separate list and add a value only if it has not already been added.',
  },

  {
    id: 25,
    language: 'Python',
    topic: 'Lists',
    title: 'Find Second Largest',
    description:
      'Create a function called second_largest that returns the second largest unique number in the list.',
    difficulty: 'Hard',
    starterCode: `def second_largest(numbers):
    # Write your code here
    pass`,
    functionName: 'second_largest',
    testCases: [
      {
        inputs: [[10, 40, 25, 40, 30, 15]],
        expectedOutput: 30,
      },
      {
        inputs: [[5, 9, 2, 9, 7]],
        expectedOutput: 7,
      },
      {
        inputs: [[100, 50, 75, 25]],
        expectedOutput: 75,
      },
      {
        inputs: [[10, 20, 30]],
        expectedOutput: 20,
      },
    ],
    explanation:
      'Track the largest and second-largest unique values.',
  },

  // ============================================================
  // 6. FUNCTIONS
  // ============================================================

  {
    id: 26,
    language: 'Python',
    topic: 'Functions',
    title: 'Calculate Square',
    description:
      'Create a function called square that accepts a number and returns its square.',
    difficulty: 'Easy',
    starterCode: `def square(number):
    # Write your code here
    pass`,
    functionName: 'square',
    testCases: [
      { inputs: [6], expectedOutput: 36 },
      { inputs: [5], expectedOutput: 25 },
      { inputs: [10], expectedOutput: 100 },
      { inputs: [-4], expectedOutput: 16 },
    ],
    explanation:
      'A square is calculated by multiplying a number by itself.',
  },

  {
    id: 27,
    language: 'Python',
    topic: 'Functions',
    title: 'Calculate Sum',
    description:
      'Create a function called add that accepts two numbers and returns their sum.',
    difficulty: 'Easy',
    starterCode: `def add(a, b):
    # Write your code here
    pass`,
    functionName: 'add',
    testCases: [
      { inputs: [10, 15], expectedOutput: 25 },
      { inputs: [5, 7], expectedOutput: 12 },
      { inputs: [-5, 10], expectedOutput: 5 },
      { inputs: [100, 200], expectedOutput: 300 },
    ],
    explanation:
      'Return the result of adding the two parameters.',
  },

  {
    id: 28,
    language: 'Python',
    topic: 'Functions',
    title: 'Check Even',
    description:
      'Create a function called is_even that returns True if a number is even and False otherwise.',
    difficulty: 'Easy',
    starterCode: `def is_even(number):
    # Write your code here
    pass`,
    functionName: 'is_even',
    testCases: [
      { inputs: [8], expectedOutput: true },
      { inputs: [7], expectedOutput: false },
      { inputs: [20], expectedOutput: true },
      { inputs: [15], expectedOutput: false },
    ],
    explanation:
      'A number is even when its remainder after division by 2 is zero.',
  },

  {
    id: 29,
    language: 'Python',
    topic: 'Functions',
    title: 'Find Maximum',
    description:
      'Create a function called find_max that accepts a list and returns the largest value without using max().',
    difficulty: 'Medium',
    starterCode: `def find_max(numbers):
    # Write your code here
    pass`,
    functionName: 'find_max',
    testCases: [
      { inputs: [[12, 45, 7, 30]], expectedOutput: 45 },
      { inputs: [[5, 9, 2]], expectedOutput: 9 },
      { inputs: [[100, 50, 75]], expectedOutput: 100 },
      { inputs: [[-5, -2, -8]], expectedOutput: -2 },
    ],
    explanation:
      'Iterate through the list and keep track of the largest value.',
  },

  {
    id: 30,
    language: 'Python',
    topic: 'Functions',
    title: 'Recursive Factorial',
    description:
      'Create a recursive function called factorial that returns the factorial of a positive integer.',
    difficulty: 'Hard',
    starterCode: `def factorial(n):
    # Write your code here
    pass`,
    functionName: 'factorial',
    testCases: [
      { inputs: [5], expectedOutput: 120 },
      { inputs: [4], expectedOutput: 24 },
      { inputs: [3], expectedOutput: 6 },
      { inputs: [1], expectedOutput: 1 },
    ],
    explanation:
      'Use a base case of 1 and recursively multiply n by factorial(n - 1).',
  },

  // ============================================================
  // 7. DICTIONARIES
  // ============================================================

  {
    id: 31,
    language: 'Python',
    topic: 'Dictionaries',
    title: 'Access Dictionary Value',
    description:
      'Create a function called get_name that accepts a student dictionary and returns the value of the "name" key.',
    difficulty: 'Easy',
    starterCode: `def get_name(student):
    # Write your code here
    pass`,
    functionName: 'get_name',
    testCases: [
      {
        inputs: [{ name: 'Mounika', age: 20 }],
        expectedOutput: 'Mounika',
      },
      {
        inputs: [{ name: 'Ravi', age: 21 }],
        expectedOutput: 'Ravi',
      },
      {
        inputs: [{ name: 'Anu', age: 19 }],
        expectedOutput: 'Anu',
      },
    ],
    explanation:
      'Access a dictionary value using its key.',
  },

  {
    id: 32,
    language: 'Python',
    topic: 'Dictionaries',
    title: 'Add Dictionary Entry',
    description:
      'Create a function called add_city that adds a "city" key with the given city value and returns the dictionary.',
    difficulty: 'Easy',
    starterCode: `def add_city(student, city):
    # Write your code here
    pass`,
    functionName: 'add_city',
    testCases: [
      {
        inputs: [{ name: 'Mounika', age: 20 }, 'Hyderabad'],
        expectedOutput: { name: 'Mounika', age: 20, city: 'Hyderabad' },
      },
      {
        inputs: [{ name: 'Ravi', age: 21 }, 'Bengaluru'],
        expectedOutput: { name: 'Ravi', age: 21, city: 'Bengaluru' },
      },
      {
        inputs: [{ name: 'Anu', age: 19 }, 'Chennai'],
        expectedOutput: { name: 'Anu', age: 19, city: 'Chennai' },
      },
    ],
    explanation:
      'Add a new dictionary entry using dictionary["city"] = city.',
  },

  {
    id: 33,
    language: 'Python',
    topic: 'Dictionaries',
    title: 'Count Dictionary Keys',
    description:
      'Create a function called count_keys that returns the number of keys in a dictionary.',
    difficulty: 'Easy',
    starterCode: `def count_keys(student):
    # Write your code here
    pass`,
    functionName: 'count_keys',
    testCases: [
      {
        inputs: [{ name: 'Mounika', age: 20, course: 'B.Tech', year: 3 }],
        expectedOutput: 4,
      },
      {
        inputs: [{ name: 'Ravi', age: 21 }],
        expectedOutput: 2,
      },
      {
        inputs: [{ a: 1, b: 2, c: 3 }],
        expectedOutput: 3,
      },
    ],
    explanation:
      'Use len() on the dictionary to count its keys.',
  },

  {
    id: 34,
    language: 'Python',
    topic: 'Dictionaries',
    title: 'Sum Dictionary Values',
    description:
      'Create a function called sum_values that returns the sum of all numeric dictionary values.',
    difficulty: 'Medium',
    starterCode: `def sum_values(marks):
    # Write your code here
    pass`,
    functionName: 'sum_values',
    testCases: [
      {
        inputs: [{ math: 85, python: 90, sql: 80 }],
        expectedOutput: 255,
      },
      {
        inputs: [{ a: 10, b: 20 }],
        expectedOutput: 30,
      },
      {
        inputs: [{ x: 5, y: 15, z: 25 }],
        expectedOutput: 45,
      },
    ],
    explanation:
      'Iterate through dictionary values and add them together.',
  },

  {
    id: 35,
    language: 'Python',
    topic: 'Dictionaries',
    title: 'Count Character Frequency',
    description:
      'Create a function called character_frequency that returns a dictionary containing the frequency of each character.',
    difficulty: 'Hard',
    starterCode: `def character_frequency(text):
    # Write your code here
    pass`,
    functionName: 'character_frequency',
    testCases: [
      {
        inputs: ['banana'],
        expectedOutput: { b: 1, a: 3, n: 2 },
      },
      {
        inputs: ['hello'],
        expectedOutput: { h: 1, e: 1, l: 2, o: 1 },
      },
      {
        inputs: ['abc'],
        expectedOutput: { a: 1, b: 1, c: 1 },
      },
    ],
    explanation:
      'Iterate through the string and increase the dictionary count for each character.',
  },

  // ============================================================
  // 8. SEARCHING
  // ============================================================

  {
    id: 36,
    language: 'Python',
    topic: 'Searching',
    title: 'Linear Search',
    description:
      'Create a function called linear_search that returns True if the target exists in the list, otherwise False.',
    difficulty: 'Easy',
    starterCode: `def linear_search(numbers, target):
    # Write your code here
    pass`,
    functionName: 'linear_search',
    testCases: [
      {
        inputs: [[10, 20, 30, 40, 50], 30],
        expectedOutput: true,
      },
      {
        inputs: [[10, 20, 30], 99],
        expectedOutput: false,
      },
      {
        inputs: [[5, 8, 12], 5],
        expectedOutput: true,
      },
    ],
    explanation:
      'Linear search checks each element until the target is found.',
  },

  {
    id: 37,
    language: 'Python',
    topic: 'Searching',
    title: 'Find Element Index',
    description:
      'Create a function called find_index that returns the index of the target without using index(). Return -1 if it is not found.',
    difficulty: 'Easy',
    starterCode: `def find_index(numbers, target):
    # Write your code here
    pass`,
    functionName: 'find_index',
    testCases: [
      {
        inputs: [[10, 20, 30, 40, 50], 40],
        expectedOutput: 3,
      },
      {
        inputs: [[5, 8, 12], 5],
        expectedOutput: 0,
      },
      {
        inputs: [[1, 2, 3], 9],
        expectedOutput: -1,
      },
    ],
    explanation:
      'Loop through the list with indexes and return the matching index.',
  },

  {
    id: 38,
    language: 'Python',
    topic: 'Searching',
    title: 'Count Occurrences',
    description:
      'Create a function called count_occurrences that counts how many times the target occurs in a list.',
    difficulty: 'Easy',
    starterCode: `def count_occurrences(numbers, target):
    # Write your code here
    pass`,
    functionName: 'count_occurrences',
    testCases: [
      {
        inputs: [[5, 2, 5, 7, 5, 9, 1], 5],
        expectedOutput: 3,
      },
      {
        inputs: [[1, 1, 1, 2], 1],
        expectedOutput: 3,
      },
      {
        inputs: [[1, 2, 3], 9],
        expectedOutput: 0,
      },
    ],
    explanation:
      'Loop through the list and increment the count whenever the value equals the target.',
  },

  {
    id: 39,
    language: 'Python',
    topic: 'Searching',
    title: 'Binary Search',
    description:
      'Create a function called binary_search that returns True if the target exists in a sorted list, otherwise False.',
    difficulty: 'Medium',
    starterCode: `def binary_search(numbers, target):
    # Write your code here
    pass`,
    functionName: 'binary_search',
    testCases: [
      {
        inputs: [[10, 20, 30, 40, 50, 60, 70], 30],
        expectedOutput: true,
      },
      {
        inputs: [[10, 20, 30, 40, 50], 60],
        expectedOutput: false,
      },
      {
        inputs: [[1, 2, 3, 4, 5], 1],
        expectedOutput: true,
      },
      {
        inputs: [[1, 2, 3, 4, 5], 5],
        expectedOutput: true,
      },
    ],
    explanation:
      'Binary search repeatedly checks the middle element and eliminates half of the search space.',
  },

  {
    id: 40,
    language: 'Python',
    topic: 'Searching',
    title: 'Find First Occurrence',
    description:
      'Create a function called first_occurrence that returns the index of the first occurrence of the target.',
    difficulty: 'Hard',
    starterCode: `def first_occurrence(numbers, target):
    # Write your code here
    pass`,
    functionName: 'first_occurrence',
    testCases: [
      {
        inputs: [[2, 5, 8, 5, 10, 5], 5],
        expectedOutput: 1,
      },
      {
        inputs: [[1, 2, 3, 2], 2],
        expectedOutput: 1,
      },
      {
        inputs: [[5, 5, 5], 5],
        expectedOutput: 0,
      },
      {
        inputs: [[1, 2, 3], 9],
        expectedOutput: -1,
      },
    ],
    explanation:
      'Traverse from the beginning and return the first matching index.',
  },

  // ============================================================
  // 9. SORTING
  // ============================================================

  {
    id: 41,
    language: 'Python',
    topic: 'Sorting',
    title: 'Sort a List',
    description:
      'Create a function called sort_list that returns the numbers in ascending order.',
    difficulty: 'Easy',
    starterCode: `def sort_list(numbers):
    # Write your code here
    pass`,
    functionName: 'sort_list',
    testCases: [
      {
        inputs: [[5, 2, 8, 1, 3]],
        expectedOutput: [1, 2, 3, 5, 8],
      },
      {
        inputs: [[10, 5, 1]],
        expectedOutput: [1, 5, 10],
      },
      {
        inputs: [[3, 3, 1, 2]],
        expectedOutput: [1, 2, 3, 3],
      },
    ],
    explanation:
      'Arrange the list values in ascending order.',
  },

  {
    id: 42,
    language: 'Python',
    topic: 'Sorting',
    title: 'Sort Descending',
    description:
      'Create a function called sort_descending that returns the numbers in descending order.',
    difficulty: 'Easy',
    starterCode: `def sort_descending(numbers):
    # Write your code here
    pass`,
    functionName: 'sort_descending',
    testCases: [
      {
        inputs: [[10, 3, 7, 1, 8]],
        expectedOutput: [10, 8, 7, 3, 1],
      },
      {
        inputs: [[1, 2, 3]],
        expectedOutput: [3, 2, 1],
      },
      {
        inputs: [[5, 5, 2, 9]],
        expectedOutput: [9, 5, 5, 2],
      },
    ],
    explanation:
      'Arrange the list values from largest to smallest.',
  },

  {
    id: 43,
    language: 'Python',
    topic: 'Sorting',
    title: 'Sort Strings',
    description:
      'Create a function called sort_names that returns the names in alphabetical order.',
    difficulty: 'Easy',
    starterCode: `def sort_names(names):
    # Write your code here
    pass`,
    functionName: 'sort_names',
    testCases: [
      {
        inputs: [['Ravi', 'Anu', 'Mohan', 'Priya']],
        expectedOutput: ['Anu', 'Mohan', 'Priya', 'Ravi'],
      },
      {
        inputs: [['Zara', 'Aman', 'John']],
        expectedOutput: ['Aman', 'John', 'Zara'],
      },
      {
        inputs: [['Bob', 'Alice', 'Charlie']],
        expectedOutput: ['Alice', 'Bob', 'Charlie'],
      },
    ],
    explanation:
      'Python can sort strings alphabetically.',
  },

  {
    id: 44,
    language: 'Python',
    topic: 'Sorting',
    title: 'Bubble Sort',
    description:
      'Create a function called bubble_sort that sorts a list in ascending order.',
    difficulty: 'Medium',
    starterCode: `def bubble_sort(numbers):
    # Write your code here
    pass`,
    functionName: 'bubble_sort',
    testCases: [
      {
        inputs: [[5, 1, 4, 2, 8]],
        expectedOutput: [1, 2, 4, 5, 8],
      },
      {
        inputs: [[3, 2, 1]],
        expectedOutput: [1, 2, 3],
      },
      {
        inputs: [[10, 5, 7, 1]],
        expectedOutput: [1, 5, 7, 10],
      },
    ],
    explanation:
      'Bubble sort repeatedly compares adjacent elements and swaps them when needed.',
  },

  {
    id: 45,
    language: 'Python',
    topic: 'Sorting',
    title: 'Sort by String Length',
    description:
      'Create a function called sort_by_length that sorts words from shortest to longest.',
    difficulty: 'Hard',
    starterCode: `def sort_by_length(words):
    # Write your code here
    pass`,
    functionName: 'sort_by_length',
    testCases: [
      {
        inputs: [['python', 'is', 'a', 'powerful', 'language']],
        expectedOutput: ['a', 'is', 'python', 'language', 'powerful'],
      },
      {
        inputs: [['hello', 'a', 'cat', 'programming']],
        expectedOutput: ['a', 'cat', 'hello', 'programming'],
      },
      {
        inputs: [['four', 'one', 'three', 'two']],
        expectedOutput: ['one', 'two', 'four', 'three'],
      },
    ],
    explanation:
      'Sort the words using their length as the sorting key.',
  },

  // ============================================================
  // 10. BASIC ALGORITHMS
  // ============================================================

  {
    id: 46,
    language: 'Python',
    topic: 'Basic Algorithms',
    title: 'Check Palindrome Number',
    description:
      'Create a function called is_palindrome_number that returns "Palindrome" or "Not Palindrome".',
    difficulty: 'Easy',
    starterCode: `def is_palindrome_number(number):
    # Write your code here
    pass`,
    functionName: 'is_palindrome_number',
    testCases: [
      { inputs: [121], expectedOutput: 'Palindrome' },
      { inputs: [123], expectedOutput: 'Not Palindrome' },
      { inputs: [1221], expectedOutput: 'Palindrome' },
      { inputs: [12321], expectedOutput: 'Palindrome' },
    ],
    explanation:
      'A palindrome number remains the same when its digits are reversed.',
  },

  {
    id: 47,
    language: 'Python',
    topic: 'Basic Algorithms',
    title: 'Find Digit Sum',
    description:
      'Create a function called digit_sum that returns the sum of all digits in a number.',
    difficulty: 'Easy',
    starterCode: `def digit_sum(number):
    # Write your code here
    pass`,
    functionName: 'digit_sum',
    testCases: [
      { inputs: [12345], expectedOutput: 15 },
      { inputs: [123], expectedOutput: 6 },
      { inputs: [999], expectedOutput: 27 },
      { inputs: [1001], expectedOutput: 2 },
    ],
    explanation:
      'Extract each digit and add it to a running total.',
  },

  {
    id: 48,
    language: 'Python',
    topic: 'Basic Algorithms',
    title: 'Count Digits',
    description:
      'Create a function called count_digits that returns the number of digits in an integer.',
    difficulty: 'Easy',
    starterCode: `def count_digits(number):
    # Write your code here
    pass`,
    functionName: 'count_digits',
    testCases: [
      { inputs: [987654], expectedOutput: 6 },
      { inputs: [123], expectedOutput: 3 },
      { inputs: [5], expectedOutput: 1 },
      { inputs: [10000], expectedOutput: 5 },
    ],
    explanation:
      'Count how many digits are present in the number.',
  },

  {
    id: 49,
    language: 'Python',
    topic: 'Basic Algorithms',
    title: 'Find GCD',
    description:
      'Create a function called gcd that returns the greatest common divisor of two numbers without using math.gcd().',
    difficulty: 'Medium',
    starterCode: `def gcd(a, b):
    # Write your code here
    pass`,
    functionName: 'gcd',
    testCases: [
      { inputs: [48, 18], expectedOutput: 6 },
      { inputs: [20, 8], expectedOutput: 4 },
      { inputs: [100, 25], expectedOutput: 25 },
      { inputs: [17, 5], expectedOutput: 1 },
    ],
    explanation:
      'The Euclidean algorithm repeatedly uses the remainder until it becomes zero.',
  },

  {
    id: 50,
    language: 'Python',
    topic: 'Basic Algorithms',
    title: 'Generate Fibonacci Sequence',
    description:
      'Create a function called fibonacci that returns the first n Fibonacci numbers starting with 0 and 1.',
    difficulty: 'Hard',
    starterCode: `def fibonacci(n):
    # Write your code here
    pass`,
    functionName: 'fibonacci',
    testCases: [
      {
        inputs: [8],
        expectedOutput: [0, 1, 1, 2, 3, 5, 8, 13],
      },
      {
        inputs: [5],
        expectedOutput: [0, 1, 1, 2, 3],
      },
      {
        inputs: [3],
        expectedOutput: [0, 1, 1],
      },
      {
        inputs: [1],
        expectedOutput: [0],
      },
    ],
    explanation:
      'Each Fibonacci number is the sum of the previous two numbers.',
  },
];