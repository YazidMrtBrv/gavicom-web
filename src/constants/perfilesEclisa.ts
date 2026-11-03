// Rail profiles and standards GAVICOM can produce joint bars for. Shared by
// /fabricacion (table and order builder) and the fixings line page, so both
// always list the same profiles. A null standard is spelled out by each page
// instead of a dash, which screen readers skip.
export type PerfilEclisa = [perfil: string, material: string, norma: string | null, proceso: string];

export const PERFILES_ECLISA: PerfilEclisa[] = [
  ["90RA-A, 100RE, 115-119RE, 132-140RE", "Acero bajo y alto carbono", "AREMA", "Fundición, forja, laminado"],
  ["50 kg, 30 kg, 37 kg", "Hierro fundido, acero bajo carbono", "GB, JIS E1110", "Fundición, forja"],
  ["P50", "Hierro fundido, acero bajo carbono", null, "Fundición, forja"],
  ["UIC60, UIC54, S49", "Acero bajo y alto carbono, hierro fundido", "UIC 864-6", "Fundición, forja"],
  ["BS80A", "Acero bajo y alto carbono, hierro fundido", "BS", "Fundición, forja"],
];
