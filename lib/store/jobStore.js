import { create } from 'zustand';
import { mockJobs, mockProposals } from '../db/schema';

const useJobStore = create((set, get) => ({
  jobs: mockJobs,
  proposals: mockProposals,
  filters: {
    category: null,
    budgetMin: 0,
    budgetMax: 100000,
    skills: [],
    urgentOnly: false
  },
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  getFilteredJobs: () => {
    const { jobs, filters } = get();
    return jobs.filter(job => {
      if (filters.urgentOnly && !job.isUrgent) return false;
      if (filters.category && job.category !== filters.category) return false;
      if (job.budgetMax < filters.budgetMin || job.budgetMin > filters.budgetMax) return false;
      if (filters.skills.length > 0) {
        const hasSkill = filters.skills.some(skill => 
          job.requiredSkills.includes(skill)
        );
        if (!hasSkill) return false;
      }
      return true;
    });
  },
  
  addProposal: (proposal) => set((state) => ({
    proposals: [...state.proposals, proposal]
  })),
  
  addJob: (job) => set((state) => ({
    jobs: [...state.jobs, job]
  }))
}));

export default useJobStore;
