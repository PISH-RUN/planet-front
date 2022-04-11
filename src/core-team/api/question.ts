import { useMutation, useQuery } from "react-query";
import { strapi } from "@kidneed/services";

export const useQuiz = (way?: string, childId?: number) =>
  useQuery(["questions", childId], () =>
      strapi
        .request<any>("get", `/children/${childId}/quiz?type=startOfMonth`),
    {
      enabled: way !== undefined && !!childId
    }
  );

export const useQuestions = (way?: string, childId?: number) =>
  useQuery(["questions", childId], () =>
      strapi
        .request<any>("get", `/children/${childId}/growth-field-questions`),
    {
      enabled: way === undefined && !!childId
    }
  );

export const useSubmitQuiz = () =>
  useMutation(({ childId, type, data }: any) =>
    strapi.request("POST", `/children/${childId}/quiz`, {
      data: {
        data: {
          type,
          answers: data
        }
      }
    }));

export const useSubmitSystemQuiz = () =>
  useMutation(({ childId, data }: any) => strapi.request("POST", `/children/${childId}/find-growth-field`, {
    data: {
      data: {
        answers: data
      }
    }
  }));