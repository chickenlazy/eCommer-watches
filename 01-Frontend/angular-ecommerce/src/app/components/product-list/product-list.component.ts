import { Component, OnInit } from "@angular/core";
import { ProductService } from "src/app/services/product.service";
import { Product } from "src/app/common/product";
import { ActivatedRoute } from "@angular/router";
import { CartItem } from "src/app/common/cart-item";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if (this.searchMode) {
      this.handleSearchProduct();
    } else {
      this.handleListProduct();
    }
  }
  handleSearchProduct() {
    const theKeyword: string | null =
      this.route.snapshot.paramMap.get("keyword");

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    } else {
      this.previousKeyword = theKeyword;
    }

    if (theKeyword !== null) {
      this.productService
        .searchProductsPaginate(
          this.thePageNumber - 1,
          this.thePageSize,
          theKeyword
        )
        .subscribe(this.processResult());
    }
  }

  handleListProduct() {
    // Lấy categoryId từ tham số đường dẫn
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      const categoryIdParam = this.route.snapshot.paramMap.get("id");
      if (categoryIdParam !== null) {
        this.currentCategoryId = +categoryIdParam;
      }
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    // Gọi hàm getProductList từ productService để lấy danh sách sản phẩm theo categoryId
    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        this.currentCategoryId
      )
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`)
 
    const theCartItem = new CartItem(theProduct);
 
    this.cartService.addToCart(theCartItem);
 
   }
}
