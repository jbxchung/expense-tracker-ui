export function readFirstLines(
    file: File,
    maxLines = 5,
    maxBytes = 200_000
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    // Only read the first chunk of the file
    const slice = file.slice(0, maxBytes);
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        resolve([]);
        return;
      }

      const text = reader.result;
      const lines = text.split(/\r?\n/).slice(0, maxLines);

      resolve(lines);
    };

    reader.onerror = reject;
    reader.readAsText(slice);
  });
}
