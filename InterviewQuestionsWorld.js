const questions = [
    // Beginner Level
    {
        id: 1,
        language: 'Web Development',
        concept: 'HTML Basics',
        question: 'What is the difference between a <div> and a <span> element in HTML?',
        answer: '- <div>: A block-level element that groups content and takes up the full width available.\n- <span>: An inline element used to group content without affecting the flow of other elements, taking up only the width of its content.',
        level: 'Beginner'
    },

    {
        id: 2,
        language: 'Web Development',
        concept: 'CSS Basics',
        question: 'What is the purpose of the "float" property in CSS?',
        answer: 'The float property in CSS is used to place an element on the left or right side of its container, allowing other content to wrap around it. It is commonly used for layout and positioning, but it can cause issues if not managed carefully with clearing techniques like clear.',
        level: 'Beginner'
    },

    // Intermediate Level
    {
        id: 3,
        language: 'Web Development',
        concept: 'CSS Layout',
        question: 'What are the differences between Flexbox and CSS Grid Layout?',
        answer: '- Flexbox: A one-dimensional layout model that is ideal for arranging elements in either a row or a column.\n- CSS Grid: A two-dimensional layout model, meaning it can handle both rows and columns simultaneously, providing more complex and flexible layouts.',
        level: 'Intermediate'
    },

    {
        id: 4,
        language: 'Web Development',
        concept: 'JavaScript DOM',
        question: 'What is the purpose of document.querySelector() in JavaScript?',
        answer: 'The document.querySelector() method in JavaScript is used to select the first element that matches a given CSS selector. It provides a powerful way to access and manipulate HTML elements dynamically in the DOM.',
        level: 'Intermediate'
    },

    // Advanced Level
    {
        id: 5,
        language: 'Web Development',
        concept: 'Responsive Web Design',
        question: 'What is the difference between "mobile-first" and "desktop-first" design in responsive web design?',
        answer: '- Mobile-first: A design strategy where you build the website for mobile devices first and then use media queries to adjust the layout for larger screens.\n- Desktop-first: A design strategy where you start with a desktop layout and then adjust it for smaller devices using media queries.',
        level: 'Advanced'
    },

    // Beginner Level - Java
    {
        id: 6,
        language: 'Java',
        concept: 'OOP Principles',
        question: 'Explain the principles of OOP in Java.',
        answer: '- **Encapsulation**: Bundling data and methods into a single unit (class) and restricting access to some components via access modifiers.\n- **Inheritance**: Mechanism where one class acquires the properties and behaviors of another class.\n- **Polymorphism**: Ability of an object to take on multiple forms, like method overloading and overriding.\n- **Abstraction**: Hiding the implementation details and showing only functionality to the user through abstract classes and interfaces.',
        level: 'Beginner'
    },

    {
        id: 7,
        language: 'Java',
        concept: 'Data Types',
        question: 'What are the different data types in Java?',
        answer: 'Java has two types of data types:\n1. **Primitive data types**: byte, short, int, long, float, double, char, boolean.\n2. **Reference data types**: Objects and arrays that hold references to data.',
        level: 'Beginner'
    }, {
        id: 8,
        language: 'Java',
        concept: 'Data s',
        question: 'What are the different data types in Java?',
        answer: 'Java has two types of data types:\n1. **Primitive data types**: byte, short, int, long, float, double, char, boolean.\n2. **Reference data types**: Objects and arrays that hold references to data.',
        level: 'Beginner'
    }, {
        id: 9,
        language: 'Java',
        concept: 'Data 1',
        question: 'What are the different data types in Java?',
        answer: 'Java has two types of data types:\n1. **Primitive data types**: byte, short, int, long, float, double, char, boolean.\n2. **Reference data types**: Objects and arrays that hold references to data.',
        level: 'Beginner'
    }, {
        id: 10,
        language: 'Java',
        concept: 'Data e',
        question: 'What are the different data types in Java?',
        answer: 'Java has two types of data types:\n1. **Primitive data types**: byte, short, int, long, float, double, char, boolean.\n2. **Reference data types**: Objects and arrays that hold references to data.',
        level: 'Beginner'
    }, {
        id: 11,
        language: 'Java',
        concept: 'Data sw',
        question: 'What are the different data types in Java?',
        answer: 'Java has two types of data types:\n1. **Primitive data types**: byte, short, int, long, float, double, char, boolean.\n2. **Reference data types**: Objects and arrays that hold references to data.',
        level: 'Beginner'
    }, {
        id: 12,
        language: 'Java',
        concept: 'Data gt',
        question: 'What are the different data types in Java?',
        answer: 'Java has two types of data types:\n1. **Primitive data types**: byte, short, int, long, float, double, char, boolean.\n2. **Reference data types**: Objects and arrays that hold references to data.',
        level: 'Beginner'
    }, {
        id: 13,
        language: 'Java',
        concept: 'Data 08',
        question: 'What are the different data types in Java?',
        answer: 'Java has two types of data types:\n1. **Primitive data types**: byte, short, int, long, float, double, char, boolean.\n2. **Reference data types**: Objects and arrays that hold references to data.',
        level: 'Beginner'
    }, {
        id: 13,
        language: 'Java',
        concept: 'Data 09',
        question: 'What are the different data types in Java?',
        answer: 'Java has two types of data types:\n1. **Primitive data types**: byte, short, int, long, float, double, char, boolean.\n2. **Reference data types**: Objects and arrays that hold references to data.',
        level: 'Beginner'
    }, {
        id: 14,
        language: 'Java',
        concept: 'Data 10',
        question: 'What are the different data types in Java?',
        answer: 'Java has two types of data types:\n1. **Primitive data types**: byte, short, int, long, float, double, char, boolean.\n2. **Reference data types**: Objects and arrays that hold references to data.',
        level: 'Beginner'
    }, {
        id: 15,
        language: 'Java',
        concept: 'Data 11',
        question: 'What are the different data types in Java?',
        answer: 'Java has two types of data types:\n1. **Primitive data types**: byte, short, int, long, float, double, char, boolean.\n2. **Reference data types**: Objects and arrays that hold references to data.',
        level: 'Beginner'
    }, {
        id: 16,
        language: 'Java',
        concept: 'Data 12',
        question: 'What are the different data types in Java?',
        answer: 'Java has two types of data types:\n1. **Primitive data types**: byte, short, int, long, float, double, char, boolean.\n2. **Reference data types**: Objects and arrays that hold references to data.',
        level: 'Beginner'
    }, {
        id: 16,
        language: 'Java',
        concept: 'Data 13',
        question: 'What are the different data types in Java?',
        answer: 'Java has two types of data types:\n1. **Primitive data types**: byte, short, int, long, float, double, char, boolean.\n2. **Reference data types**: Objects and arrays that hold references to data.',
        level: 'Beginner'
    },

];
// Variables for pagination and filtering
let displayedQuestions = 0;
const questionsPerPage = 1000;
// Function to display questions
function displayQuestions(filteredQuestions) {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = ''; // Clear existing questions

    filteredQuestions.slice(0, displayedQuestions + questionsPerPage).forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-item');
        questionDiv.innerHTML = `
            <h3>${question.question}</h3>
            <p><strong>Concept:</strong> ${question.concept} <br> <strong>Language:</strong> ${question.language} <br> <strong>Level:</strong> ${question.level} <br> <strong>Answer:</strong> ${question.answer}</p>
        `;
        questionsList.appendChild(questionDiv);
    });


}



// Function to filter questions based on search input and language
function filterQuestions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const languageFilter = document.getElementById('languageFilter').value;

    const filteredQuestions = questions.filter(question => {
        const matchesSearch = question.question.toLowerCase().includes(searchTerm) || question.concept.toLowerCase().includes(searchTerm);
        const matchesLanguage = !languageFilter || question.language === languageFilter;
        return matchesSearch && matchesLanguage;
    });

    displayedQuestions = 0; // Reset to display the first batch of questions
    displayQuestions(filteredQuestions);
}

// Event listener for filtering based on language and search
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('languageFilter').value = 'Java'; // Set default language to Java
    filterQuestions(); // Initial filter for Java language

    // Add event listeners to the search input and language filter
    document.getElementById('searchInput').addEventListener('input', filterQuestions);
    document.getElementById('languageFilter').addEventListener('change', filterQuestions);
});
