import { create } from "zustand";
import { Evaluate } from "@/@types/evaluate.type";
import { EvaluateClient } from "@/clients/evaluate.client";
import { Pagination } from "@/common/struct/pagination.struct";
import { PaginationDto } from "@/common/dto/pagination.dto";
import { EvaluateCreateDto } from "@/dto/evaluate.dto";

const evaluateClient = new EvaluateClient();

export interface EvaluateState {
    isLoading: boolean;
    evaluates: Pagination<Evaluate> | null;
    evaluate: Evaluate | null;
    select: Evaluate | null;
    search: string;
    totalEvaluates: number;
    currentPage: number;
    list: Evaluate[];
    setSearch: (search: string) => void;
    setSelect: (evaluate: Evaluate) => void;
    fetchEvaluates: (pagination: PaginationDto) => Promise<void>;
    createEvaluate: (data: Partial<EvaluateCreateDto>) => Promise<void>;
    updateEvaluate: (id: string, data: Partial<EvaluateCreateDto>) => Promise<void>;
    deleteEvaluate: (id: string) => Promise<void>;
    getById: (id: string) => Promise<void>;
    getByIdTourist: (id: string) => Promise<void>;
}

export const useEvaluateStore = create<EvaluateState>((set, get) => ({
    isLoading: false,
    evaluates: null,
    evaluate: null,
    select: null,
    search: "",
    totalEvaluates: 0,
    currentPage: 1,
    list: [],

    setSearch: (search: string) => {
        set({ search });
    },

    fetchEvaluates: async (pagination: PaginationDto) => {
        set({ isLoading: true });
        try {
            const response = await evaluateClient.getAllEvaluates(pagination);
            set({
                evaluates: response as any,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    setSelect: (evaluate: Evaluate) => {
        set({ select: evaluate });
    },

    createEvaluate: async (data: Partial<EvaluateCreateDto>) => {
        set({ isLoading: true });
        try {
            await evaluateClient.createEvaluate(data);
            await get().fetchEvaluates({ page: 1, limit: 10 });
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    updateEvaluate: async (id: string, data: Partial<EvaluateCreateDto>) => {
        set({ isLoading: true });
        try {
            await evaluateClient.updateEvaluate(id, data);
            await get().fetchEvaluates({ page:1, limit: 10 });
            set({ isLoading: false });
        } catch (error) {
            console.error("Failed to update evaluate:", error);
            set({ isLoading: false });
        }
    },

    deleteEvaluate: async (id: string) => {
        set({ isLoading: true });
        try {
            await evaluateClient.deleteEvaluate(id);
            await get().fetchEvaluates({ page: 1, limit: 10 });
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    getById: async (id: string) => {
        set({ isLoading: true });
        try {
            const result: any = await evaluateClient.getEvaluateById(id);
            set({
                evaluate: result,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    getByIdTourist: async (id: string) => {
        set({ isLoading: true });
        try {
            const result: any = await evaluateClient.getEvaluateByIdTourist(id);
            set({
                list: result,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },
}));