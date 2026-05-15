import type { IRule } from "@/types/rule.types";
import { dnxApi } from "../dnxApi";

const ruleApi = dnxApi.injectEndpoints({
    endpoints: (build) => ({
        createRule: build.mutation<IRule, IRule>({
            query: (body) => ({
                url: '/rules',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['rules'],
        }),
        getRuleByType: build.query<{data:IRule}, string>({
            query: (type: string) => {
                return {
                    url: '/rules',
                    params: {
                        type,
                    },
                    method: 'GET',
                }
            },
            providesTags: (_result, _err, type) => [
                { type: 'rules', id: type },
                'rules',
            ],
        }),
    }),
})

export const {useCreateRuleMutation, useGetRuleByTypeQuery } = ruleApi;