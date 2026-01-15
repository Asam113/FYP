import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  isAvailable: boolean;
}

interface MenuCategory {
  id: number;
  title: string;
  badge: string;
  badgeClass: string;
  itemCount: number;
  isOpen?: boolean;
  items: MenuItem[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {

  categories: MenuCategory[] = [
    {
      id: 1,
      title: 'Desi Cuisine',
      badge: 'Traditional',
      badgeClass: 'bg-primary-subtle text-primary border-primary-subtle',
      itemCount: 3,
      isOpen: true, // Open by default for demo
      items: [
        { id: 101, name: 'Chicken Biryani', description: 'Aromatic basmati rice with spiced chicken', price: 450, image: null, isAvailable: true },
        { id: 102, name: 'Chicken Karahi', description: 'Traditional wok-cooked chicken curry', price: 400, image: null, isAvailable: true },
        { id: 103, name: 'Seekh Kabab (2 pcs)', description: 'Grilled minced meat skewers', price: 300, image: null, isAvailable: true }
      ]
    },
    {
      id: 2,
      title: 'Fast Food',
      badge: 'Western',
      badgeClass: 'bg-indigo-subtle text-indigo border-indigo-subtle',
      itemCount: 4,
      isOpen: false,
      items: [
        { id: 201, name: 'Zinger Burger', description: 'Crispy fried chicken burger', price: 350, image: null, isAvailable: true },
        { id: 202, name: 'Club Sandwich', description: 'Layered sandwich with chicken and egg', price: 300, image: null, isAvailable: true }
      ]
    },
    {
      id: 3,
      title: 'BBQ',
      badge: 'Grilled',
      badgeClass: 'bg-info-subtle text-info border-info-subtle',
      itemCount: 3,
      isOpen: false,
      items: []
    }
  ];

  // Modal State
  isAddItemModalOpen = false;
  isEditMode = false;
  selectedCategoryForAdd: MenuCategory | null = null;
  selectedItemOriginal: MenuItem | null = null;
  newItem: Partial<MenuItem> = { name: '', description: '', price: 0, image: null, isAvailable: true };

  // Add Menu Modal State
  isAddMenuModalOpen = false;
  newMenu = { title: '', badge: '' };

  addMenu() {
    this.openAddMenuModal();
  }

  openAddMenuModal() {
    this.newMenu = { title: '', badge: '' };
    this.isAddMenuModalOpen = true;
  }

  closeAddMenuModal() {
    this.isAddMenuModalOpen = false;
  }

  submitAddMenu() {
    if (this.newMenu.title && this.newMenu.badge) {
      const newCategory: MenuCategory = {
        id: Date.now(),
        title: this.newMenu.title,
        badge: this.newMenu.badge,
        badgeClass: 'bg-secondary-subtle text-secondary border-secondary-subtle', // Default style
        itemCount: 0,
        isOpen: true,
        items: []
      };

      this.categories.unshift(newCategory); // Add to top
      this.closeAddMenuModal();
    }
  }

  // Open Add Item Modal
  openAddItemModal(category: MenuCategory) {
    this.isEditMode = false;
    this.selectedCategoryForAdd = category;
    this.selectedItemOriginal = null;
    this.newItem = { name: '', description: '', price: 0, image: null, isAvailable: true }; // Reset form
    this.isAddItemModalOpen = true;
  }

  // Open Edit Item Modal
  openEditItemModal(category: MenuCategory, item: MenuItem) {
    this.isEditMode = true;
    this.selectedCategoryForAdd = category;
    this.selectedItemOriginal = item;
    // Clone the item data to the form
    this.newItem = {
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      isAvailable: item.isAvailable
    };
    this.isAddItemModalOpen = true;
  }

  // Close Modal
  closeAddItemModal() {
    this.isAddItemModalOpen = false;
    this.selectedCategoryForAdd = null;
    this.selectedItemOriginal = null;
    this.isEditMode = false;
  }

  onItemImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd upload this. For mock, we'll just check existence or create a URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newItem.image = e.target.result; // Data URL for preview
      };
      reader.readAsDataURL(file);
    }
  }

  // Submit Item (Add or Edit)
  submitAddItem() {
    if (this.selectedCategoryForAdd && this.newItem.name && this.newItem.price) {

      if (this.isEditMode && this.selectedItemOriginal) {
        // Update existing item
        this.selectedItemOriginal.name = this.newItem.name!;
        this.selectedItemOriginal.description = this.newItem.description || '';
        this.selectedItemOriginal.price = this.newItem.price!;
        this.selectedItemOriginal.image = this.newItem.image || null;
        this.selectedItemOriginal.isAvailable = this.newItem.isAvailable !== undefined ? this.newItem.isAvailable : true;
      } else {
        // Create new item
        const item: MenuItem = {
          id: Date.now(), // Simple ID generation
          name: this.newItem.name!,
          description: this.newItem.description || '',
          price: this.newItem.price!,
          image: this.newItem.image || null,
          isAvailable: this.newItem.isAvailable !== undefined ? this.newItem.isAvailable : true
        };

        this.selectedCategoryForAdd.items.push(item);
        this.selectedCategoryForAdd.itemCount = this.selectedCategoryForAdd.items.length;
      }

      this.closeAddItemModal();
    }
  }

  // Delete Modal State
  isDeleteModalOpen = false;
  deleteTarget: { type: 'category' | 'item', category?: MenuCategory, item?: MenuItem } | null = null;
  deleteMessage = '';

  deleteCategory(category: MenuCategory) {
    this.deleteTarget = { type: 'category', category };
    this.deleteMessage = `Are you sure you want to delete ${category.title}?`;
    this.isDeleteModalOpen = true;
  }

  toggleCategory(category: MenuCategory) {
    category.isOpen = !category.isOpen;
  }

  deleteItem(category: MenuCategory, item: MenuItem) {
    this.deleteTarget = { type: 'item', category, item };
    this.deleteMessage = `Are you sure you want to delete ${item.name}?`;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.deleteTarget = null;
  }

  confirmDelete() {
    if (this.deleteTarget?.type === 'category' && this.deleteTarget.category) {
      this.categories = this.categories.filter(c => c.id !== this.deleteTarget!.category!.id);
    } else if (this.deleteTarget?.type === 'item' && this.deleteTarget.category && this.deleteTarget.item) {
      this.deleteTarget.category.items = this.deleteTarget.category.items.filter(i => i.id !== this.deleteTarget!.item!.id);
      this.deleteTarget.category.itemCount = this.deleteTarget.category.items.length;
    }
    this.closeDeleteModal();
  }
}
