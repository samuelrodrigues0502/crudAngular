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

@Component({
  selector: 'app-product-list',
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    CommonModule
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

  openNewProduct() {
    this.displayDialog = true;
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
