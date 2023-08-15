package com.watches.ecommerce.dao;

import com.watches.ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "states", path="states")
public interface StateRepository extends JpaRepository<State, Integer> {

//    @Query("SELECT s FROM State s WHERE s.country.id = :countryId")
    List<State> findByCountryCode(@Param("code") String code);
}
