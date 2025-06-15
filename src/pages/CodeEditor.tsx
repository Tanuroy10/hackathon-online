import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, Download, Settings, Terminal } from 'lucide-react';

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState(`// Welcome to the Code Editor!
// Write your code here and click Run to execute

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}
`);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('Click "Run Code" to see output...');
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
  ];

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');

    // Simulate code execution
    setTimeout(() => {
      try {
        if (language === 'javascript') {
          // For demo purposes, we'll just show the code
          let result = '';
          const originalLog = console.log;
          
          // Capture console.log output
          const logs: string[] = [];
          console.log = (...args) => {
            logs.push(args.join(' '));
          };

          try {
            // Use eval for demo (not recommended in production)
            eval(code);
            result = logs.join('\n') || 'Code executed successfully (no output)';
          } catch (error: any) {
            result = `Error: ${error.message}`;
          } finally {
            console.log = originalLog;
          }

          setOutput(result);
        } else {
          setOutput(`${language.toUpperCase()} execution simulated successfully!\n\nNote: This is a demo environment. In a real implementation, code would be executed on a secure backend server.`);
        }
      } catch (error) {
        setOutput(`Error: ${error}`);
      } finally {
        setIsRunning(false);
      }
    }, 1500);
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'javascript' ? 'js' : language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sampleCodes: Record<string, string> = {
    javascript: `// JavaScript Example
function greetUser(name) {
  return \`Hello, \${name}! Welcome to StudyHub.\`;
}

console.log(greetUser("Student"));

// Array manipulation
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);`,
    
    python: `# Python Example
def greet_user(name):
    return f"Hello, {name}! Welcome to StudyHub."

print(greet_user("Student"))

# List comprehension
numbers = [1, 2, 3, 4, 5]
squared = [n**2 for n in numbers]
print("Squared numbers:", squared)`,
    
    java: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Student! Welcome to StudyHub.");
        
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.print("Numbers: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
    }
}`,
  };

  const loadSample = () => {
    if (sampleCodes[language]) {
      setCode(sampleCodes[language]);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Code Editor</h1>
          <p className="text-white/70">Write, test, and debug your code in real-time</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-gray-800">
                {lang.label}
              </option>
            ))}
          </select>
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
          >
            Load Sample
          </button>
        </div>
      </div>

      {/* Editor and Output Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h3 className="text-white font-medium">Editor</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
              <button
                onClick={saveCode}
                className="flex items-center space-x-2 px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-96">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>

        {/* Output Console */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-white" />
              <h3 className="text-white font-medium">Output Console</h3>
            </div>
            <button
              onClick={() => setOutput('')}
              className="px-3 py-1 bg-white/10 text-white text-sm rounded border border-white/20 hover:bg-white/20 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="p-4 h-96 overflow-y-auto">
            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <h3 className="text-white font-medium mb-2">💡 Pro Tips</h3>
        <ul className="text-white/70 text-sm space-y-1">
          <li>• Use Ctrl+S (Cmd+S on Mac) to save your code</li>
          <li>• Use Ctrl+/ (Cmd+/ on Mac) to toggle comments</li>
          <li>• The editor supports syntax highlighting and auto-completion</li>
          <li>• Try different programming languages from the dropdown</li>
        </ul>
      </div>
    </div>
  );
};

export default CodeEditor;