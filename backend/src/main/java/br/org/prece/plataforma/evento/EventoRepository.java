package br.org.prece.plataforma.evento;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EventoRepository extends JpaRepository<Evento, String> {

    List<Evento> findByDataBetweenOrderByDataAscTituloAsc(LocalDate inicio, LocalDate fim);
}
