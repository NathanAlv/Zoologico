import sql from '../config/db';
import Cage from '../types/Jaula';
import Species from '../types/Especie';
import Caretaker from '../types/Zelador';
import Specimen, { parseSpecimen } from '../types/Especime';

export const getSpecimenBySpecies = async (species: Species): Promise<Specimen[]> => {
  const response = await sql`
    SELECT * FROM especime
      INNER JOIN especie ON especime.id_especie = especie.id
      WHERE especie.id = ${Number(species.id)};
  `;

  const specimen = response.map(async (jsonObject) => await parseSpecimen(jsonObject));

  return await Promise.all(specimen);
}

export const getSpecimenByCage = async (cage: Cage): Promise<Specimen[]> => {
  const response = await sql`
    SELECT * FROM especime
      INNER JOIN jaula ON especime.id_jaula = jaula.codigo
      WHERE codigo = ${cage.code};
  `;

  const specimen = response.map(async (jsonObject) => await parseSpecimen(jsonObject));

  return await Promise.all(specimen);
}

export const getSpecimenByCaretaker = async (caretaker: Caretaker): Promise<Specimen[]> => {
  const response = await sql`
    SELECT especime.id, especime.nro_de_serie, especime.apelido, especime.id_especie, especime.id_jaula
      FROM zelador
      INNER JOIN jaula_zelador ON zelador.matricula = jaula_zelador.id_zelador
      INNER JOIN especime ON especime.id_jaula = jaula_zelador.id_jaula
      WHERE matricula LIKE ${caretaker.matriculation};
  `;

  const specimen = response.map(async (jsonObject) => await parseSpecimen(jsonObject));
  
  return await Promise.all(specimen);
}