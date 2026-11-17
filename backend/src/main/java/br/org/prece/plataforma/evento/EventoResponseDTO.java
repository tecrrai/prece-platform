package br.org.prece.plataforma.evento;

import java.time.LocalDate;

public record EventoResponseDTO(String id, String titulo, LocalDate data) {

    public EventoResponseDTO(Evento evento) {
        this(evento.getId(), evento.getTitulo(), evento.getData());
    }
}
