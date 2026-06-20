// We define the type right here so Vercel knows exactly what bg, color, and svgPath are.
export interface IssueCardData {
  title: string;
  description: string;
  duration: string;
  bg?: string;
  color?: string;
  svgPath?: string;
}

export default function IssueCard({ issue }: { issue: IssueCardData }) {
  return (
    <button className="flex flex-col text-left p-6 bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200 w-full group border border-slate-100/50">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${issue.bg} ${issue.color}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={issue.svgPath} />
        </svg>
      </div>
      
      <div className="mb-5">
        <h3 className="font-bold text-slate-900 text-[16px] mb-1.5">{issue.title}</h3>
        <p className="text-[13px] text-slate-500 leading-relaxed pr-4">{issue.description}</p>
      </div>
      
      <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {issue.duration}
        </div>
        <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors group-hover:translate-x-1 transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </div>
    </button>
  );
}