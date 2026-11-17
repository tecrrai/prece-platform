package br.org.prece.plataforma;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/** Testes de integracao dos endpoints REST (H2 em memoria, perfil "test"). */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper json;

    private String cadastroJson(String atuacao, String email) {
        return """
            {"atuacao":"%s","nome":"Maria Silva","endereco":"Rua A, 10","cep":"63500000","uf":"CE",
             "municipio":"Quixadá","telefone":"88999999999","email":"%s","senha":"senha1234"}
            """.formatted(atuacao, email);
    }

    private String novoEmail() {
        return "user-" + UUID.randomUUID() + "@exemplo.com";
    }

    private String registrarERetornarToken(String atuacao, String email) throws Exception {
        String corpo = mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(cadastroJson(atuacao, email)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        JsonNode node = json.readTree(corpo);
        return node.get("token").asText();
    }

    @Test
    void cadastroELoginFuncionam() throws Exception {
        String email = novoEmail();
        registrarERetornarToken("ALUNO", email);

        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"senha\":\"senha1234\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.usuario.perfil").value("ALUNO"));
    }

    @Test
    void emailDuplicadoRetorna409() throws Exception {
        String email = novoEmail();
        registrarERetornarToken("ALUNO", email);

        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(cadastroJson("ALUNO", email)))
                .andExpect(status().isConflict());
    }

    @Test
    void cadastroNaoPermiteCriarAdmin() throws Exception {
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(cadastroJson("ADMIN", novoEmail())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.atuacao").exists());
    }

    @Test
    void loginComSenhaErradaRetorna401() throws Exception {
        String email = novoEmail();
        registrarERetornarToken("ALUNO", email);

        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"senha\":\"errada123\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void meExigeTokenValido() throws Exception {
        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/auth/me").header("Authorization", "Bearer token-invalido"))
                .andExpect(status().isUnauthorized());

        String email = novoEmail();
        String token = registrarERetornarToken("PROFESSOR", email);
        mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.perfil").value("PROFESSOR"));
    }

    @Test
    void calendarioEPublicoEContemFeriadosSemeados() throws Exception {
        int ano = LocalDate.now().getYear();
        mvc.perform(get("/api/eventos")
                        .param("start_date", ano + "-11-01").param("end_date", ano + "-11-30"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].titulo", hasItem("Finados")))
                .andExpect(jsonPath("$[*].titulo", hasItem("Proclamação da República")));
    }

    @Test
    void apenasProfessorOuAdminCriamEventos() throws Exception {
        String corpo = "{\"titulo\":\"Reunião pedagógica\",\"data\":\"2026-11-10\"}";

        mvc.perform(post("/api/eventos").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isUnauthorized());

        String tokenAluno = registrarERetornarToken("ALUNO", novoEmail());
        mvc.perform(post("/api/eventos").header("Authorization", "Bearer " + tokenAluno)
                        .contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isForbidden());

        String tokenProfessor = registrarERetornarToken("PROFESSOR", novoEmail());
        mvc.perform(post("/api/eventos").header("Authorization", "Bearer " + tokenProfessor)
                        .contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Reunião pedagógica"));
    }
}
