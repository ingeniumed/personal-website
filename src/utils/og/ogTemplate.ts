import satori from "satori";

// Satori accepts React-like JSX objects but doesn't export a specific type for them.
// Extract the element type from satori's function signature.
type SatoriElement = Parameters<typeof satori>[0];

/**
 * Common wrapper for OG images with dual-border design.
 * Creates the characteristic shadow + main border effect.
 *
 * @param content - The inner content to wrap (title, description, etc.)
 * @returns Satori-compatible JSX object with wrapper applied
 */
export function wrapInOgBorder(content: SatoriElement): SatoriElement {
  return {
    type: "div",
    props: {
      style: {
        background: "#fefbfb",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      children: [
        // Shadow layer
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "-1px",
              right: "-1px",
              border: "4px solid #000",
              background: "#ecebeb",
              opacity: "0.9",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              margin: "2.5rem",
              width: "88%",
              height: "80%",
            },
          },
        },
        // Main border with content
        {
          type: "div",
          props: {
            style: {
              border: "4px solid #000",
              background: "#fefbfb",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              margin: "2rem",
              width: "88%",
              height: "80%",
            },
            children: content,
          },
        },
      ],
    },
  };
}
