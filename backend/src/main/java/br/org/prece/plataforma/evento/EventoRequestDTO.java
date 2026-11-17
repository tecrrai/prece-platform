package br.org.prece.plataforma.evento;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EventoRequestDTO(
        @NotBlank @Size(max = 120) String titulo,
        @NotNull LocalDate data) {
}
