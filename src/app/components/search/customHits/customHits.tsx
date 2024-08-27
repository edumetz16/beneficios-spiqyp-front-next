'use client'
import { Link } from "@nextui-org/react";
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
          onClick={() => sendEvent('click', hit, 'Hit Clicked')}
          onAuxClick={() => sendEvent('click', hit, 'Hit Clicked')}
          href={`/benefits/${hit.objectID}`}
        >
            <Highlight hit={hit} attribute="name" className="Hit-label" />

        </Link>
      ))}
    </ol>}
    </>
  );
}