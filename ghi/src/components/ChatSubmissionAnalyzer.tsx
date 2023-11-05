import CodeEditor from './CodeEditor';

export const requestWrapper = (code: string) => `
Given the Python3 LeetCode solution provided:

Identify the problem's name, e.g., "1. TwoSum".
Determine if the solution is "Correct" or "Not Correct".
Assess if it's "Optimal" or "Not Optimal".
If incorrect, provide the correct and optimal solution.
Your reply should be brief and adhere strictly to the specified format for API use.

Code:
${code}
`;

const ChatSubmissionAnalyzer = ({
  loading,
  chatResponse,
}: {
  loading: boolean;
  chatResponse: string;
}) => {
  return (
    <div>
      <CodeEditor
        height="65vh"
        value={loading ? 'loading...' : chatResponse}
        language="python"
        showLineNumbers={false}
        theme="vs-dark"
        readOnly={true}
      />
    </div>
  );
};

export default ChatSubmissionAnalyzer;
