// app/(public)/about/team-member-card.tsx
import type { TeamMember } from "./types";

export default function TeamMemberCard({ name, role, image }: TeamMember) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-lime-400/20 to-purple-600/20">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
                {name?.charAt(0) ?? "?"}
              </div>
            </div>
          </>
        )}
      </div>
      <h4 className="text-white font-semibold mb-1 group-hover:text-lime-400 transition-colors">
        {name}
      </h4>
      <p className="text-white/60 text-sm">{role}</p>
    </div>
  );
}
