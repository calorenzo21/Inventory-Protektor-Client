import { ApiProperty } from '@nestjs/swagger';

export class RevertLoadResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Carga revertida exitosamente' })
  message: string;

  @ApiProperty({ example: '47c43c47-dc72-4f4f-beee-2dd3e5ee3edd' })
  loadId: string;

  @ApiProperty({ example: 5 })
  revertedSheets: number;

  @ApiProperty({ example: 25 })
  revertedTransactions: number;
}
