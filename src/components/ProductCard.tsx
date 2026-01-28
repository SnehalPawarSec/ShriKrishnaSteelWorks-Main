import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductDetailsModal from './ProductDetailsModal';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id?: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price?: string;
  specifications?: Array<{ key: string; value: string }>;
}

const ProductCard = ({ name, description, image, category, price, specifications }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  // Enhanced product data for modal
  const getProductDetails = () => {
    const baseProduct = {
      name,
      description,
      image,
      category,
      price,
      // Use Firestore specifications if available, otherwise use defaults
      specifications: specifications || []
    };

    // If Firestore specifications exist, return early with them
    if (specifications && specifications.length > 0) {
      return {
        ...baseProduct,
        specifications,
        features: [
          'Durable construction',
          'Professional finish',
          'Customizable options',
          'Reliable performance'
        ],
        dimensions: 'Custom available',
        material: 'Steel',
        weight: 'As per design',
        warranty: '1 year'
      };
    }

    // Add specific details based on product name/category (fallback for non-Firestore products)
    switch (name.toLowerCase()) {
      case 'structural steel beams':
        return {
          ...baseProduct,
          specifications: [
            'ISI certified steel grade',
            'High tensile strength',
            'Corrosion resistant coating',
            'Precision engineered dimensions'
          ],
          features: [
            'Heavy-duty construction',
            'Weather resistant',
            'Easy installation',
            'Long-lasting durability'
          ],
          dimensions: 'Custom sizes available',
          material: 'Structural Steel',
          weight: 'Varies by size',
          warranty: '5 years'
        };
      
      case 'custom steel gates':
        return {
          ...baseProduct,
          specifications: [
            'Powder coated finish',
            'Anti-rust treatment',
            'Custom design options',
            'Professional installation'
          ],
          features: [
            'Security focused design',
            'Weather resistant',
            'Low maintenance',
            'Customizable aesthetics'
          ],
          dimensions: 'As per requirements',
          material: 'Mild Steel',
          weight: 'Varies by design',
          warranty: '3 years'
        };
      
      case 'industrial platforms':
        return {
          ...baseProduct,
          specifications: [
            'Heavy-duty construction',
            'Non-slip surface',
            'Modular design',
            'Easy assembly'
          ],
          features: [
            'Industrial grade materials',
            'Safety compliant',
            'Modular system',
            'Quick installation'
          ],
          dimensions: 'Modular sizes',
          material: 'Industrial Steel',
          weight: 'Varies by configuration',
          warranty: '2 years'
        };
      
      default:
        return {
          ...baseProduct,
          specifications: [
            'Premium quality materials',
            'Professional fabrication',
            'Custom specifications available',
            'Quality assurance'
          ],
          features: [
            'Durable construction',
            'Professional finish',
            'Customizable options',
            'Reliable performance'
          ],
          dimensions: 'Custom available',
          material: 'Steel',
          weight: 'As per design',
          warranty: '1 year'
        };
    }
  };

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleAddToCart = () => {
    const productData = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description,
      image,
      category,
      price,
      ...getProductDetails()
    };
    addToCart(productData);
  };

  return (
    <>
    <Card className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-steel">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="mb-2">{category}</Badge>
          {price && <span className="text-sm font-semibold text-primary">{price}</span>}
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">{name}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 hero-gradient" onClick={handleViewDetails}>
            View Details
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={getProductDetails()}
      />
    </>
  );
};

export default ProductCard;