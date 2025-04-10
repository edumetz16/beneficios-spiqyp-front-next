'use client'
import { Image, Link } from "@heroui/react";
import React from 'react';
import {
    Highlight,
  useHits,
  UseHitsProps,
} from 'react-instantsearch';

export default function CustomHits(props: UseHitsProps) {
  const { items, sendEvent } = useHits(props);

  return (
    <>
    {items && items.length>0 && <ol className={`w-full p-6 bg-gray-200 flex flex-col gap-4`}>
      {items.map((hit) => (
        <Link
          key={hit.objectID}
          onPress={() => sendEvent('click', hit, 'Hit Clicked')}
          onAuxClick={() => sendEvent('click', hit, 'Hit Clicked')}
          href={`/benefits/${hit.objectID}`}
        >
          <Image src={hit.companyImage} alt={hit.name} width={100} height={100} className="w-12 h-12 object-cover mr-4"/>
            <Highlight hit={hit} attribute="name" className="Hit-label" />

        </Link>
      ))}
    </ol>}
    </>
  );
}