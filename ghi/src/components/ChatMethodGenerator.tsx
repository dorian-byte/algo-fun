import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { getChatResponse } from '../utils/queryChat';
import { gql, useQuery } from '@apollo/client';

const GET_ALL_METHODS = gql`
  query GetAllMethods {
    allTopics {
      id
      name
    }
  }
`;

const requestWrapper = (code: string) => `
Identify method(s) or data structures from the provided list of methods that are utilized in the given code. Please only pick value(s) from the provided list of methods, and only return an array that I can use in javascript. Don’t say anything else.

list of methods: 
[
  'rolling hash',
  'trie',
  'rejection sampling',
  'hash table',
  'breadth-first search',
  'linked list',
  'random',
  'recursion',
  'two pointers',
  'queue',
  'binary indexed tree',
  'dynamic programming',
  'oop',
  'depth-first search',
  'tree',
  'union find',
  'memoization',
  'graph',
  'stack',
  'ordered map',
  'minimax',
  'suffix array',
  'sliding window',
  'string',
  'heap',
  'math',
  'sort',
  'geometry',
  'greedy',
  'bit manipulation',
  'topological sort',
  'reservoir sampling',
  'binary search tree',
  'meet in the middle',
  'dequeue',
  'design',
  'array',
  'backtracking',
  'line sweep',
  'brainteaser',
  'binary search',
  'divide and conquer',
  'segment tree',
];

# NOTE: the def twoSum() function below is an example. You should return ['hash table', 'array'].
# def twoSum(nums, target):
#     seen = {}
#     for i, num in enumerate(nums):
#         diff = target - num
#         if diff in seen:
#             return [seen[diff], i]
#         seen[num] = i

# NOTE: this function below is the real function I need answer for.
${code}
`;
const ChatMethodGenerator = ({
  data,
  setData,
}: {
  data: any;
  setData: any;
}) => {
  // rename "data" to "topics" because there is already a data variable
  const { data: topics } = useQuery(GET_ALL_METHODS);
  const [loading, setLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState<any>('');
  const [methodsArr, setMethodsArr] = useState<any>([]);
  useEffect(() => {
    if (chatResponse) {
      const res = JSON.parse(chatResponse.replace(/'/g, '"'));
      if (topics) {
        const topicsHash = topics.allTopics.reduce((acc: any, item: any) => {
          acc[item.name] = parseInt(item.id);
          return acc;
        }, {});
        console.log('topicsHash', topicsHash);
        setMethodsArr(res);
        setData({
          ...data,
          methods: res
            .map((item: any) => topicsHash[item])
            .filter((item: any) => item),
        });
      }
    }
  }, [chatResponse, topics]);

  return (
    <div className="mt-2" style={{ minHeight: 150 }}>
      <div className="mb-3 d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-primary font-size-12"
          onClick={async (e) => {
            setData({ ...data, methods: [] });
            e.preventDefault();
            getChatResponse({
              setLoading,
              setChatResponse,
              query: requestWrapper(data.code),
            });
          }}
        >
          generate methods
        </button>
        {loading && (
          <CircularProgress
            className="text-primary"
            style={{ width: 20, height: 20 }}
          />
        )}
      </div>
      <div className="d-flex flex-wrap gap-2 ">
        {methodsArr?.map((item: any) => (
          <div key={item} className="badge bg-warning text-dark">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMethodGenerator;
