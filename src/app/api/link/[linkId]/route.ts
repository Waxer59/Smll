import { NextRequest } from 'next/server';

interface Params {
  linkId: string;
}

export async function GET(request: NextRequest, params: Params) {}
export async function PATCH(request: NextRequest, params: Params) {}
export async function DELETE(request: NextRequest, params: Params) {}
