import { GoogleGenAI, Type } from "@google/genai";
import { NcmResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const fetchTaxInfoByNcm = async (ncm: string): Promise<NcmResponse> => {
  if (!apiKey) {
    throw new Error("API Key não configurada.");
  }

  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Atue como um Consultor Fiscal Brasileiro Sênior.
    
    Tarefa Principal: Analisar o NCM "${ncm}" focando em PIS/COFINS (Regime Não-Cumulativo) e gerar um comparativo com produtos similares.
    
    Tarefa Secundária (Comparativo ERP):
    Liste até 5 produtos/NCMs "Similares" ou "Correlatos". Para cada um, gere um "Perfil Tributário" simulando descrições comuns de ERPs (como na imagem: "TRIBUTADO 19% CST 00", "SUBST TRIB CST 60", "ISENTO CST 40").
    
    Regras para os Similares:
    1. Tente variar os perfis se houver produtos parecidos com tributação diferente (ex: um tributado integralmente e outro com ST ou benefício).
    2. No campo 'erpProfile', use o formato: "SITUAÇÃO + ALÍQUOTA (ICMS Base) + CST". Ex: "TRIBUTADO 18% CST 00", "RED. BASE CALC CST 20", "SUBST. TRIB. CST 60".
    3. Nos campos 'cstEntry' e 'cstOutput', coloque os códigos numéricos sugeridos (Ex: E:000, S:020).
    
    Para o produto principal (taxes), mantenha o foco no PIS/COFINS Federal.
    
    Retorne o JSON estritamente conforme o schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING, description: "Nome técnico do produto" },
            description: { type: Type.STRING, description: "Descrição do produto" },
            ncmCode: { type: Type.STRING, description: "O código NCM formatado" },
            taxes: {
              type: Type.OBJECT,
              properties: {
                cstPisEntrada: {
                  type: Type.OBJECT,
                  properties: { code: { type: Type.STRING }, description: { type: Type.STRING } }
                },
                cstPisSaida: {
                  type: Type.OBJECT,
                  properties: { code: { type: Type.STRING }, description: { type: Type.STRING } }
                },
                cstCofinsEntrada: {
                  type: Type.OBJECT,
                  properties: { code: { type: Type.STRING }, description: { type: Type.STRING } }
                },
                cstCofinsSaida: {
                  type: Type.OBJECT,
                  properties: { code: { type: Type.STRING }, description: { type: Type.STRING } }
                }
              },
              required: ["cstPisEntrada", "cstPisSaida", "cstCofinsEntrada", "cstCofinsSaida"]
            },
            similarProducts: {
              type: Type.ARRAY,
              description: "Lista de NCMs similares com perfil estilo ERP",
              items: {
                type: Type.OBJECT,
                properties: {
                  ncm: { type: Type.STRING, description: "Código NCM do similar" },
                  name: { type: Type.STRING, description: "Nome do produto similar" },
                  erpProfile: { type: Type.STRING, description: "String estilo ERP: 'TRIBUTADO 19% CST 00'" },
                  cstEntry: { type: Type.STRING, description: "Código Entrada (ex: 000)" },
                  cstOutput: { type: Type.STRING, description: "Código Saída (ex: 020)" }
                }
              }
            },
            legalNote: { type: Type.STRING, description: "Explicação legal" }
          },
          required: ["productName", "description", "taxes", "legalNote", "ncmCode", "similarProducts"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as NcmResponse;
    }
    throw new Error("Não foi possível gerar os dados tributários.");
  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    throw error;
  }
};