package br.org.prece.plataforma.evento;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

/**
 * Leitura publica (a tela inicial mostra o calendario sem login).
 * Escrita restrita a PROFESSOR e ADMIN (regra em SecurityConfig).
 */
@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    private final EventoRepository repository;

    public EventoController(EventoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<EventoResponseDTO> listar(
            @RequestParam(name = "start_date", required = false) LocalDate inicio,
            @RequestParam(name = "end_date", required = false) LocalDate fim) {

        List<Evento> eventos = (inicio != null && fim != null)
                ? repository.findByDataBetweenOrderByDataAscTituloAsc(inicio, fim)
                : repository.findAll();

        return eventos.stream().map(EventoResponseDTO::new).toList();
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventoResponseDTO criar(@Valid @RequestBody EventoRequestDTO dto) {
        Evento evento = repository.save(new Evento(dto.titulo().trim(), dto.data()));
        return new EventoResponseDTO(evento);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public EventoResponseDTO atualizar(@PathVariable String id, @Valid @RequestBody EventoRequestDTO dto) {
        Evento evento = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado"));

        evento.setTitulo(dto.titulo().trim());
        evento.setData(dto.data());

        return new EventoResponseDTO(repository.save(evento));
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado");
        }
        repository.deleteById(id);
    }
}
