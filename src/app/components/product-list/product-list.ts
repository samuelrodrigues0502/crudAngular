import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

// Módulo necessário para diretivas Angular (*ngIf, *ngFor, pipes, etc)
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Product, ProductFormData } from '../../models/product.model';

// Módulos PrimeNG para o formulário
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-product-list',
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TextareaModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {

  productService = inject(ProductService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  products = this.productService.products;
  totalProducts = this.productService.totalProducts;
  totalStockValue = this.productService.totalStockValue;

  displayDialog = false;
  displayEditDialog = false;

  editingProductId: string | null = null;

  categories = [
    {label: 'Eletrônicos', value:'electronics'},
    {label: 'Roupas', value:'clothing'},
    {label: 'Alimentos', value:'food'},
    {label: 'Livros', value:'books'},
    {label: 'Brinquedos', value:'toys'},
    {label: 'Outros', value:'others'}
  ]

  editProductForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    category: new FormControl('', Validators.required),
    stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    imageUrl: new FormControl('')
  });

  openNewProduct() {
    this.editProductForm.reset({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      imageUrl: ''
    });
    this.displayDialog = true;
  }

  saveNewProduct() {
    if (this.editProductForm.invalid) {
      this.editProductForm.markAllAsTouched();
      return;
    }

    const formData = this.editProductForm.getRawValue() as ProductFormData;
    const created = this.productService.createProduct(formData);

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso!',
      detail: `Produto "${created.name}" criado com sucesso.`,
      life: 3000
    });

    this.closeNewDialog();
  }

  closeNewDialog() {
    this.displayDialog = false;
    this.editProductForm.reset({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      imageUrl: ''
    });
  }

  openEditProduct(product: Product) {
    this.editingProductId = product.id;

    this.editProductForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl
    });

    this.displayEditDialog = true;
  }

  saveEdit(){
    if (this.editProductForm.invalid || !this.editingProductId) return;

    const formData = this.editProductForm.value as ProductFormData;
    const updated = this.productService.updateProduct(this.editingProductId, formData);

    if (updated) {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso!',
        detail: `Produto "${formData.name}" atualizado com sucesso.`,
        life: 3000
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro!',
        detail: 'Não foi possível atualizar o produto.',
        life: 3000
      });
    }

    this.displayEditDialog = false;
  }

  closeEditDialog() {
    this.displayEditDialog = false;
    this.editingProductId = null;
    this.editProductForm.reset({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      imageUrl: ''
    });
  }

  deleteProduct(id: string, productName: string){
    this.confirmationService.confirm({
      message: `Você está prestes a excluir o produto "${productName}". Esta ação não pode ser desfeita.`,
      header: 'Excluir Produto',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      defaultFocus: 'reject',
      accept: () => {
        const deleted = this.productService.deleteProduct(id);
        if (deleted) {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: `Produto "${productName}" excluído com sucesso.`,
            life: 3000
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Não foi possível excluir o produto.',
            life: 3000
          });
        }
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Exclusão cancelada pelo usuário.',
          life: 2000
        });
      }
    });
  }

  formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }


}
