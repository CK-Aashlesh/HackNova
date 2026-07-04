"use client";

/**
 * Premium matte black background system:
 * - Matte dark canvas (#080808) with a subtle charcoal gradient.
 * - Subtle grid texture for structural alignment.
 * - Monochromatic noise overlay to prevent flatness.
 * - Procedural design with zero canvas/particle overhead.
 */
export default function StarField() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#080808]">
      {/* Subtle charcoal radial gradient centered in the viewport */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, #121212 0%, #080808 80%)",
        }}
      />
      {/* Structural layout grid */}
      <div className="absolute inset-0 bg-grid opacity-[0.15]" />
      {/* Ambient noise texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.035] mix-blend-overlay" />
    </div>
  );
}
