import Carousel from "@/app/components/Carousel";
import {
  Button,
  Image,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";

const ModalDetailsProduct = ({ product, isOpen, onClose, onAddCart }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-md">
        {(onCloseModal) => (
          <>
            <ModalHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="mb-0 font-bold uppercase text-large">
                {product.data.name}
              </h4>
              <p className=" text-sm uppercase font-semibold">
                {product.data.type}
              </p>
              {product.data.amount >= 1 ? (
                <p className="text-xs text-green-400 uppercase">disponible</p>
              ) : (
                <p className="text-xs text-red-400 uppercase">no disponible</p>
              )}
              <p className="text-xs text-gray-500 uppercase">
                {product.data.modifier}
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="mb-4 w-[75%] flex justify-center">
                <Carousel images={product.data.productPictures} />
              </div>
              <h2 className="text-2xl font-bold ">${product.data.price}</h2>
              {product.data.description && (
                <div className="mt-1">
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold text-sm uppercase">
                      Descripción:
                    </span>{" "}
                    <br />
                    <span className="text-sm">{product.data.description}</span>
                  </p>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="justify-between">
              <Button auto onClick={onCloseModal}>
                Cerrar
              </Button>
              {product.data.amount >= 1 ? (
                <Button auto onClick={() => onAddCart(product)}>
                  Agregar al carrito
                </Button>
              ) : (
                <Button
                  disabled="true"
                  className="text-red-500 bg-transparent"
                  auto
                  onClick={() => onAddCart(product)}
                >
                  AGOTADO
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalDetailsProduct;
