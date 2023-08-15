package com.watches.ecommerce.dao;

import com.watches.ecommerce.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "countries", path="countries")
//collectionResourceRel: Xac dinh duong dan cho tap hop cac thuc the (/countries)
//path: Xac dinh duong dan co so cho API cho Repository
public interface CountryRepository extends JpaRepository<Country, Integer> {

    //xác định một truy vấn tùy chỉnh để truy xuất danh sách các quốc gia có thể phân trang có tên chứa một chuỗi con cụ thể.
//    Page<Country> findByNameContaining(@Param("name") String name, Pageable pageable);






}
