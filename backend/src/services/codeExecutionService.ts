import { CodeExecutionRequest, CodeExecutionResponse } from '../types';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

class CodeExecutionService {
  private async executeJavaScript(code: string): Promise<CodeExecutionResponse> {
    try {
      const wrappedCode = `
        (async () => {
          let output = '';
          const originalConsole = { ...console };
          console.log = (...args) => {
            const formatted = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            output += formatted + '\\n';
            originalConsole.log(formatted);
          };
          
          try {
            ${code}
          } catch (error) {
            console.log('Error:', error.message);
          }

          console.log = originalConsole.log;
          return output;
        })().then(output => console.log(output));
      `;

      const tempFile = path.join(__dirname, `temp_${Date.now()}.js`);
      await fs.writeFile(tempFile, wrappedCode);
      console.log('Executing JavaScript file:', tempFile);

      try {
        const { stdout, stderr } = await execAsync(`node "${tempFile}"`);
        console.log('JavaScript output:', stdout || stderr);
        return { output: stdout || stderr };
      } finally {
        await fs.unlink(tempFile).catch(() => {});
      }
    } catch (error: any) {
      console.error('JavaScript execution error:', error);
      return { output: '', error: error.message };
    }
  }

  private async executeTypeScript(code: string): Promise<CodeExecutionResponse> {
    try {
      const wrappedCode = `
        let output: string = '';
        const originalConsole = { ...console };
        console.log = (...args: any[]) => {
          const formatted = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          output += formatted + '\\n';
        };
        
        try {
          ${code}
        } catch (error: any) {
          output += 'Error: ' + error.message + '\\n';
        }

        console.log = originalConsole.log;
        process.stdout.write(output);
      `;

      const tempFile = path.join(__dirname, `temp_${Date.now()}.ts`);
      await fs.writeFile(tempFile, wrappedCode);
      console.log('Executing TypeScript file:', tempFile);

      try {
        const { stdout, stderr } = await execAsync(`npx ts-node "${tempFile}"`);
        console.log('TypeScript output:', stdout || stderr);
        return { output: stdout || stderr };
      } finally {
        await fs.unlink(tempFile).catch(() => {});
      }
    } catch (error: any) {
      console.error('TypeScript execution error:', error);
      return { output: '', error: error.message };
    }
  }

  private async executePython(code: string): Promise<CodeExecutionResponse> {
    try {
      const wrappedCode = `
import sys
from io import StringIO

def run_code():
    # Capture output
    output = StringIO()
    sys.stdout = output
    
    try:
        exec("""${code}""")
    except Exception as e:
        print(f"Error: {str(e)}")
    
    # Get captured output
    return output.getvalue()

# Run code and print output
result = run_code()
sys.stdout = sys.__stdout__
print(result, end='')
`;

      const tempFile = path.join(__dirname, `temp_${Date.now()}.py`);
      await fs.writeFile(tempFile, wrappedCode);
      console.log('Executing Python file:', tempFile);

      try {
        const { stdout, stderr } = await execAsync(`python3 "${tempFile}"`);
        console.log('Python output:', stdout || stderr);
        return { output: stdout || stderr };
      } finally {
        await fs.unlink(tempFile).catch(() => {});
      }
    } catch (error: any) {
      console.error('Python execution error:', error);
      return { output: '', error: error.message };
    }
  }

  private async executeJava(code: string): Promise<CodeExecutionResponse> {
    try {
      const classMatch = code.match(/public\s+class\s+(\w+)/);
      const className = classMatch ? classMatch[1] : 'Main';
      
      const wrappedCode = classMatch ? code : `
public class Main {
    public static void main(String[] args) {
        try {
            ${code}
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}`;

      const tempDir = path.join(__dirname, `temp_${Date.now()}`);
      await fs.mkdir(tempDir);
      const tempFile = path.join(tempDir, `${className}.java`);

      try {
        await fs.writeFile(tempFile, wrappedCode);
        console.log('Executing Java file:', tempFile);
        
        const { stderr: compileError } = await execAsync(`javac "${tempFile}"`);
        if (compileError) {
          console.error('Java compilation error:', compileError);
          return { output: '', error: compileError };
        }

        const { stdout, stderr } = await execAsync(`cd "${tempDir}" && java ${className}`);
        console.log('Java output:', stdout || stderr);
        return { output: stdout || stderr };
      } finally {
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
      }
    } catch (error: any) {
      console.error('Java execution error:', error);
      return { output: '', error: error.message };
    }
  }

  private async executeCpp(code: string): Promise<CodeExecutionResponse> {
    try {
      const hasMain = code.includes('main');
      const wrappedCode = hasMain ? code : `
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    try {
        ${code}
    } catch (const exception& e) {
        cout << "Error: " << e.what() << endl;
    }
    return 0;
}`;

      const tempDir = path.join(__dirname, `temp_${Date.now()}`);
      await fs.mkdir(tempDir);
      const sourcePath = path.join(tempDir, 'main.cpp');
      const execPath = path.join(tempDir, 'program');

      try {
        await fs.writeFile(sourcePath, wrappedCode);
        console.log('Executing C++ file:', sourcePath);
        
        const { stderr: compileError } = await execAsync(`g++ -Wall -std=c++17 "${sourcePath}" -o "${execPath}"`);
        if (compileError) {
          console.error('C++ compilation error:', compileError);
          return { output: '', error: compileError };
        }

        const { stdout, stderr } = await execAsync(`"${execPath}"`, { timeout: 5000 });
        console.log('C++ output:', stdout || stderr);
        return { output: stdout || stderr };
      } finally {
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
      }
    } catch (error: any) {
      console.error('C++ execution error:', error);
      return { output: '', error: error.message };
    }
  }

  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    const { code, language } = request;
    console.log(`Executing ${language} code:`, code);

    if (!code.trim()) {
      return { output: '', error: 'Code cannot be empty' };
    }

    switch (language.toLowerCase()) {
      case 'javascript':
        return this.executeJavaScript(code);
      case 'typescript':
        return this.executeTypeScript(code);
      case 'python':
        return this.executePython(code);
      case 'java':
        return this.executeJava(code);
      case 'cpp':
      case 'c++':
        return this.executeCpp(code);
      default:
        return {
          output: '',
          error: `Unsupported language: ${language}. Supported languages are: JavaScript, TypeScript, Python, Java, and C++`,
        };
    }
  }
}

export const codeExecutionService = new CodeExecutionService(); 