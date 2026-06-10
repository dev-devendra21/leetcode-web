import axios from "axios";

export function getJudge0LanguageId(language: string) {
  const languageMap = {
    JAVA: 62,
    PYTHON: 71,
    JAVASCRIPT: 97,
  };

  return languageMap[language.toUpperCase() as keyof typeof languageMap];
}

export async function submitBatch(submissions: any) {
  const options = {
    method: "POST",
    url: "https://judge0-extra-ce1.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": "06175f86cemsh47004bb1ae1d17bp1d6662jsn3ea9c5ef4c63",
      "x-rapidapi-host": "judge0-extra-ce1.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions: submissions,
    },
  };
  const { data } = await axios.request(options);

  return data;
}

export async function pollBatchResults(tokens: string[]) {
  while (true) {
    const options = {
      method: "GET",
      url: "https://judge0-extra-ce1.p.rapidapi.com/submissions/batch",
      params: {
        tokens: tokens.join(","),
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": "06175f86cemsh47004bb1ae1d17bp1d6662jsn3ea9c5ef4c63",
        "x-rapidapi-host": "judge0-extra-ce1.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.request(options);

    const results = data.submissions;

    const isAllDone = results.every(
      (result: any) => result.status.id !== 1 && result.status.id !== 2,
    );
    if (isAllDone) {
      return results;
    }

    await sleep(1000);
  }
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
