package br.org.prece.plataforma.config;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import br.org.prece.plataforma.evento.Evento;
import br.org.prece.plataforma.evento.EventoRepository;
import br.org.prece.plataforma.usuario.Perfil;
import br.org.prece.plataforma.usuario.Usuario;
import br.org.prece.plataforma.usuario.UsuarioRepository;

/** Dados iniciais: usuario admin e feriados nacionais (ano anterior, atual e proximo). */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;
    private final PasswordEncoder passwordEncoder;

    private final String adminNome;
    private final String adminEmail;
    private final String adminSenha;

    public DataInitializer(
            UsuarioRepository usuarioRepository,
            EventoRepository eventoRepository,
            PasswordEncoder passwordEncoder,
            @Value("${prece.admin.nome}") String adminNome,
            @Value("${prece.admin.email}") String adminEmail,
            @Value("${prece.admin.senha}") String adminSenha) {
        this.usuarioRepository = usuarioRepository;
        this.eventoRepository = eventoRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminNome = adminNome;
        this.adminEmail = adminEmail;
        this.adminSenha = adminSenha;
    }

    @Override
    public void run(String... args) {
        criarAdmin();
        criarFeriados();
    }

    private void criarAdmin() {
        String email = adminEmail.trim().toLowerCase();
        if (usuarioRepository.existsByEmail(email)) {
            return;
        }
        usuarioRepository.save(Usuario.builder()
                .nome(adminNome)
                .email(email)
                .senha(passwordEncoder.encode(adminSenha))
                .perfil(Perfil.ADMIN)
                .build());
    }

    private void criarFeriados() {
        if (eventoRepository.count() > 0) {
            return;
        }
        int ano = LocalDate.now().getYear();
        List<Evento> eventos = new ArrayList<>();
        for (int a = ano - 1; a <= ano + 1; a++) {
            eventos.add(new Evento("Confraternização Universal", LocalDate.of(a, 1, 1)));
            eventos.add(new Evento("Tiradentes", LocalDate.of(a, 4, 21)));
            eventos.add(new Evento("Dia do Trabalho", LocalDate.of(a, 5, 1)));
            eventos.add(new Evento("Independência do Brasil", LocalDate.of(a, 9, 7)));
            eventos.add(new Evento("Nossa Senhora Aparecida", LocalDate.of(a, 10, 12)));
            eventos.add(new Evento("Finados", LocalDate.of(a, 11, 2)));
            eventos.add(new Evento("Proclamação da República", LocalDate.of(a, 11, 15)));
            eventos.add(new Evento("Dia da Consciência Negra", LocalDate.of(a, 11, 20)));
            eventos.add(new Evento("Natal", LocalDate.of(a, 12, 25)));
        }
        eventoRepository.saveAll(eventos);
    }
}
